declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"2002-05-21-cameras-rolls-photos-and-albums.mdx": {
	id: "2002-05-21-cameras-rolls-photos-and-albums.mdx";
  slug: "2002-05-21-cameras-rolls-photos-and-albums";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2002-08-10-summer-2002.mdx": {
	id: "2002-08-10-summer-2002.mdx";
  slug: "2002-08-10-summer-2002";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2002-11-08-wedding.mdx": {
	id: "2002-11-08-wedding.mdx";
  slug: "2002-11-08-wedding";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2002-12-10-shan-pam-the-perfect-wedding.mdx": {
	id: "2002-12-10-shan-pam-the-perfect-wedding.mdx";
  slug: "2002-12-10-shan-pam-the-perfect-wedding";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-02-06-moved-to-paris.mdx": {
	id: "2003-02-06-moved-to-paris.mdx";
  slug: "2003-02-06-moved-to-paris";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-02-07-omi-and-prefecture.mdx": {
	id: "2003-02-07-omi-and-prefecture.mdx";
  slug: "2003-02-07-omi-and-prefecture";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-02-12-finding-apartment.mdx": {
	id: "2003-02-12-finding-apartment.mdx";
  slug: "2003-02-12-finding-apartment";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-02-16-tour-effiel.mdx": {
	id: "2003-02-16-tour-effiel.mdx";
  slug: "2003-02-16-tour-effiel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-02-23-visting-top-sights.mdx": {
	id: "2003-02-23-visting-top-sights.mdx";
  slug: "2003-02-23-visting-top-sights";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-03-04-signing-the-lease.mdx": {
	id: "2003-03-04-signing-the-lease.mdx";
  slug: "2003-03-04-signing-the-lease";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-03-18-moving-to-apartment.mdx": {
	id: "2003-03-18-moving-to-apartment.mdx";
  slug: "2003-03-18-moving-to-apartment";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-03-20-terry-and-greg-in-paris.mdx": {
	id: "2003-03-20-terry-and-greg-in-paris.mdx";
  slug: "2003-03-20-terry-and-greg-in-paris";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-03-30-visit-to-ram-krishna-mission.mdx": {
	id: "2003-03-30-visit-to-ram-krishna-mission.mdx";
  slug: "2003-03-30-visit-to-ram-krishna-mission";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-04-02-louvre.mdx": {
	id: "2003-04-02-louvre.mdx";
  slug: "2003-04-02-louvre";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-04-19-picnic-with-ritu.mdx": {
	id: "2003-04-19-picnic-with-ritu.mdx";
  slug: "2003-04-19-picnic-with-ritu";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-05-06-welcome-to-paris-an-unofficial-guide-by-malc.mdx": {
	id: "2003-05-06-welcome-to-paris-an-unofficial-guide-by-malc.mdx";
  slug: "2003-05-06-welcome-to-paris-an-unofficial-guide-by-malc";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-05-10-second-titre-de-sejour.mdx": {
	id: "2003-05-10-second-titre-de-sejour.mdx";
  slug: "2003-05-10-second-titre-de-sejour";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-05-16-metro-on-strike.mdx": {
	id: "2003-05-16-metro-on-strike.mdx";
  slug: "2003-05-16-metro-on-strike";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-05-18-purbayan-and-satyajit.mdx": {
	id: "2003-05-18-purbayan-and-satyajit.mdx";
  slug: "2003-05-18-purbayan-and-satyajit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-05-25-music-cite-universitaire.mdx": {
	id: "2003-05-25-music-cite-universitaire.mdx";
  slug: "2003-05-25-music-cite-universitaire";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-06-06-visiting-paris-a-desi-guide.mdx": {
	id: "2003-06-06-visiting-paris-a-desi-guide.mdx";
  slug: "2003-06-06-visiting-paris-a-desi-guide";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-06-09-trip-to-amsterdam-june-7th-9th.mdx": {
	id: "2003-06-09-trip-to-amsterdam-june-7th-9th.mdx";
  slug: "2003-06-09-trip-to-amsterdam-june-7th-9th";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-07-18-cantal.mdx": {
	id: "2003-07-18-cantal.mdx";
  slug: "2003-07-18-cantal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-08-08-heat-wave-of-august.mdx": {
	id: "2003-08-08-heat-wave-of-august.mdx";
  slug: "2003-08-08-heat-wave-of-august";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-08-11-london-5days-july-29th-aug-3rd.mdx": {
	id: "2003-08-11-london-5days-july-29th-aug-3rd.mdx";
  slug: "2003-08-11-london-5days-july-29th-aug-3rd";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-08-15-stockholm-aug-14th-17th.mdx": {
	id: "2003-08-15-stockholm-aug-14th-17th.mdx";
  slug: "2003-08-15-stockholm-aug-14th-17th";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-09-15-rome-sep-5th-7th.mdx": {
	id: "2003-09-15-rome-sep-5th-7th.mdx";
  slug: "2003-09-15-rome-sep-5th-7th";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-11-08-paper-anniversary.mdx": {
	id: "2003-11-08-paper-anniversary.mdx";
  slug: "2003-11-08-paper-anniversary";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2003-12-31-back-from-vacation.mdx": {
	id: "2003-12-31-back-from-vacation.mdx";
  slug: "2003-12-31-back-from-vacation";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-01-26-poem-ballad_of_the_soldier.mdx": {
	id: "2023-01-26-poem-ballad_of_the_soldier.mdx";
  slug: "2023-01-26-poem-ballad_of_the_soldier";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-01-27-poem-seasons_and_the_elm_tree.mdx": {
	id: "2023-01-27-poem-seasons_and_the_elm_tree.mdx";
  slug: "2023-01-27-poem-seasons_and_the_elm_tree";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-01-28-poem-the_serene_forests_of_india.mdx": {
	id: "2023-01-28-poem-the_serene_forests_of_india.mdx";
  slug: "2023-01-28-poem-the_serene_forests_of_india";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-01-29-tiger-poem.mdx": {
	id: "2023-01-29-tiger-poem.mdx";
  slug: "2023-01-29-tiger-poem";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-01-30-poem-rage.mdx": {
	id: "2023-01-30-poem-rage.mdx";
  slug: "2023-01-30-poem-rage";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-01-31-poem-pride-and-revolution.mdx": {
	id: "2023-01-31-poem-pride-and-revolution.mdx";
  slug: "2023-01-31-poem-pride-and-revolution";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-09-13-khardungla-challenge.mdx": {
	id: "2023-09-13-khardungla-challenge.mdx";
  slug: "2023-09-13-khardungla-challenge";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-10-03-Khardung-La.mdx": {
	id: "2023-10-03-Khardung-La.mdx";
  slug: "2023-10-03-khardung-la";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};
"santm-testing-image": {
"1.mdx": {
	id: "1.mdx";
  slug: "1";
  body: string;
  collection: "santm-testing-image";
  data: any
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
