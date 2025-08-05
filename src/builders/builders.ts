import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class QueryBuilder<T extends keyof PrismaClient> {
  private model: PrismaClient[T] & { findMany: Function };
  private query: Record<string, any>;
  private options: Prisma.Args<PrismaClient[T], "findMany">;

  constructor(modelName: T, query: Record<string, any>) {
    this.model = prisma[modelName] as PrismaClient[T] & { findMany: Function };
    this.query = query;
    this.options = {
      where: {} as any,
      orderBy: [],
      take: undefined,
      skip: undefined,
      select: undefined,
      include: undefined, // Include initialized
    } as Prisma.Args<PrismaClient[T], "findMany">;
  }

  // Add this new method
  select(fields: Record<string, boolean>) {
    this.options.select = fields;
    return this;
  }

  addManualFilter(filter: Record<string, any>) {
    this.options.where = {
      ...this.options.where,
      ...filter,
    };
    return this;
  }
  search(defaultFields: string[] = []) {
    if (this.query.search) {
      const searchQueries = Array.isArray(this.query.search)
        ? this.query.search
        : [this.query.search];

      const fields = this.query.searchFields
        ? this.query.searchFields.split(",")
        : defaultFields;

      if (!fields.length) return this;

      const noticeValidEnumValues = ["ONLINE", "GENERAL", "COMMON"];
      const noticeAudienceValidEnumValues = ["TEACHER", "STUDENT", "BOTH"];
      const profExamEnumValues = [
        "First_Prof_Exam",
        "Second_Prof_Exam",
        "Third_Prof_Exam",
        "Fourth_Prof_Exam",
      ];

      const conditions = searchQueries.map((searchQuery) => ({
        OR: fields
          .map((field: string) => {
            const trimmedQuery = searchQuery.trim();

            if (field === "category") {
              return noticeValidEnumValues.includes(trimmedQuery.toUpperCase())
                ? { [field]: { equals: trimmedQuery.toUpperCase() } }
                : null;
            }

            if (field === "targetedAudience") {
              return noticeAudienceValidEnumValues.includes(
                trimmedQuery.toUpperCase()
              )
                ? { [field]: { equals: trimmedQuery.toUpperCase() } }
                : null;
            }

            if (field === "ProfExamNumber") {
              return profExamEnumValues.includes(trimmedQuery)
                ? { [field]: { equals: trimmedQuery } }
                : null;
            }

            if (field === "batch") {
              // "batch" is a relation, can't apply `contains` directly
              return null;
            }

            return {
              [field]: {
                contains: trimmedQuery,
                mode: "insensitive", 
              },
            };
          })
          .filter(Boolean), // remove nulls
      }));

      (this.options.where as any).AND = conditions;
    }
    return this;
  }

  // Filtering
  filter() {
    const excludedFields = [
      "search",
      "sortBy",
      "order",
      "page",
      "limit",
      "fields",
      "include",
    ];
    Object.keys(this.query).forEach((key) => {
      if (!excludedFields.includes(key)) {
        (this.options.where as any)[key] = this.query[key];
      }
    });
    return this;
  }

  // Sorting
  sort() {
    if (this.query.sortBy) {
      const order = this.query.order?.toLowerCase() === "desc" ? "desc" : "asc";
      this.options.orderBy = [{ [this.query.sortBy]: order }];
    }
    return this;
  }

  // Pagination
  paginate() {
    if (this.query.page && this.query.limit) {
      const page = parseInt(this.query.page) || 1;
      const limit = parseInt(this.query.limit) || 10;
      this.options.take = limit;
      this.options.skip = (page - 1) * limit;
    }
    return this;
  }

  // Field selection
  fields() {
    if (this.query.fields) {
      this.options.select = this.query.fields
        .split(",")
        .reduce((acc: Record<string, boolean>, field: string) => {
          acc[field] = true;
          return acc;
        }, {});
    }
    return this;
  }

  // Dynamic Include (accepts from query params or directly as an argument)
  include(includes?: Record<string, any>) {
    if (includes) {
      // If includes are explicitly passed as an argument, use them directly
      this.options.include = includes;
    } else if (this.query.include) {
      try {
        // Try parsing JSON if the user provides an object-like string
        this.options.include = JSON.parse(this.query.include);
      } catch (error) {
        // If parsing fails, assume comma-separated values and build include object
        const includedRelations = this.query.include.split(",");
        this.options.include = includedRelations.reduce(
          (acc: Record<string, boolean>, relation: string) => {
            acc[relation.trim()] = true;
            return acc;
          },
          {}
        );
      }
    }
    return this;
  }

  async execute() {
    const page = parseInt(this.query.page);
    const limit = parseInt(this.query.limit);
    const hasPagination = !isNaN(page) && !isNaN(limit);

    if (hasPagination) {
      this.options.take = limit;
      this.options.skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        (this.model as any).findMany(this.options),
        (this.model as any).count({ where: this.options.where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
        data,
      };
    }

    // Remove take/skip if not paginating to avoid Prisma interpreting undefined
    const { take, skip, ...restOptions } = this.options;

    return (this.model as any).findMany(restOptions);
  }
}
