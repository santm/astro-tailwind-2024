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
"2004-02-14-st-michel.mdx": {
	id: "2004-02-14-st-michel.mdx";
  slug: "2004-02-14-st-michel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-02-20-a-year-in-paris.mdx": {
	id: "2004-02-20-a-year-in-paris.mdx";
  slug: "2004-02-20-a-year-in-paris";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-03-08-got-an-ipod.mdx": {
	id: "2004-03-08-got-an-ipod.mdx";
  slug: "2004-03-08-got-an-ipod";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-05-08-la-hollande-allez-y-maintenant.mdx": {
	id: "2004-05-08-la-hollande-allez-y-maintenant.mdx";
  slug: "2004-05-08-la-hollande-allez-y-maintenant";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-05-10-barcelona.mdx": {
	id: "2004-05-10-barcelona.mdx";
  slug: "2004-05-10-barcelona";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-05-10-provence-south-of-france.mdx": {
	id: "2004-05-10-provence-south-of-france.mdx";
  slug: "2004-05-10-provence-south-of-france";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-06-05-itlay-revisited.mdx": {
	id: "2004-06-05-itlay-revisited.mdx";
  slug: "2004-06-05-itlay-revisited";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-06-12-musee-guimet.mdx": {
	id: "2004-06-12-musee-guimet.mdx";
  slug: "2004-06-12-musee-guimet";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-08-17-disneyland-paris.mdx": {
	id: "2004-08-17-disneyland-paris.mdx";
  slug: "2004-08-17-disneyland-paris";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-08-22-paris-in-night-mode.mdx": {
	id: "2004-08-22-paris-in-night-mode.mdx";
  slug: "2004-08-22-paris-in-night-mode";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-08-26-opera-alcina.mdx": {
	id: "2004-08-26-opera-alcina.mdx";
  slug: "2004-08-26-opera-alcina";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-10-18-greece.mdx": {
	id: "2004-10-18-greece.mdx";
  slug: "2004-10-18-greece";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-11-12-chateau-de-versailles.mdx": {
	id: "2004-11-12-chateau-de-versailles.mdx";
  slug: "2004-11-12-chateau-de-versailles";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-11-22-loire-valley.mdx": {
	id: "2004-11-22-loire-valley.mdx";
  slug: "2004-11-22-loire-valley";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2004-12-18-happy-holidays.mdx": {
	id: "2004-12-18-happy-holidays.mdx";
  slug: "2004-12-18-happy-holidays";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-04-15-new-pc.mdx": {
	id: "2005-04-15-new-pc.mdx";
  slug: "2005-04-15-new-pc";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-17-bonjour.mdx": {
	id: "2005-05-17-bonjour.mdx";
  slug: "2005-05-17-bonjour";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-20-vienna-austria.mdx": {
	id: "2005-05-20-vienna-austria.mdx";
  slug: "2005-05-20-vienna-austria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-21-madrid-spain.mdx": {
	id: "2005-05-21-madrid-spain.mdx";
  slug: "2005-05-21-madrid-spain";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-22-granada-spain.mdx": {
	id: "2005-05-22-granada-spain.mdx";
  slug: "2005-05-22-granada-spain";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-23-alhambra-granada-spain.mdx": {
	id: "2005-05-23-alhambra-granada-spain.mdx";
  slug: "2005-05-23-alhambra-granada-spain";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-24-seville-spain.mdx": {
	id: "2005-05-24-seville-spain.mdx";
  slug: "2005-05-24-seville-spain";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-25-cordoba-spain.mdx": {
	id: "2005-05-25-cordoba-spain.mdx";
  slug: "2005-05-25-cordoba-spain";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-25-evening-in-seville-spain.mdx": {
	id: "2005-05-25-evening-in-seville-spain.mdx";
  slug: "2005-05-25-evening-in-seville-spain";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-26-seville-spain.mdx": {
	id: "2005-05-26-seville-spain.mdx";
  slug: "2005-05-26-seville-spain";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-28-lisbon-portugal.mdx": {
	id: "2005-05-28-lisbon-portugal.mdx";
  slug: "2005-05-28-lisbon-portugal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-29-hotel-train-lisbon-to-madrid.mdx": {
	id: "2005-05-29-hotel-train-lisbon-to-madrid.mdx";
  slug: "2005-05-29-hotel-train-lisbon-to-madrid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-05-31-lost-pictures-recovered.mdx": {
	id: "2005-05-31-lost-pictures-recovered.mdx";
  slug: "2005-05-31-lost-pictures-recovered";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-08-05-how-to-puttygen-puttssh-for-ssh.mdx": {
	id: "2005-08-05-how-to-puttygen-puttssh-for-ssh.mdx";
  slug: "2005-08-05-how-to-puttygen-puttssh-for-ssh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-08-11-banner-with-imagemgick-convert.mdx": {
	id: "2005-08-11-banner-with-imagemgick-convert.mdx";
  slug: "2005-08-11-banner-with-imagemgick-convert";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-08-11-ssh-and-scp.mdx": {
	id: "2005-08-11-ssh-and-scp.mdx";
  slug: "2005-08-11-ssh-and-scp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-09-16-new-look-to-web-site.mdx": {
	id: "2005-09-16-new-look-to-web-site.mdx";
  slug: "2005-09-16-new-look-to-web-site";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-09-26-running-paris-versailles.mdx": {
	id: "2005-09-26-running-paris-versailles.mdx";
  slug: "2005-09-26-running-paris-versailles";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-09-29-gallery2.mdx": {
	id: "2005-09-29-gallery2.mdx";
  slug: "2005-09-29-gallery2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-10-05-french-class.mdx": {
	id: "2005-10-05-french-class.mdx";
  slug: "2005-10-05-french-class";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-10-11-migrating-rrd-database-between-different-architecture.mdx": {
	id: "2005-10-11-migrating-rrd-database-between-different-architecture.mdx";
  slug: "2005-10-11-migrating-rrd-database-between-different-architecture";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-10-20-tibx-shoe-laces.mdx": {
	id: "2005-10-20-tibx-shoe-laces.mdx";
  slug: "2005-10-20-tibx-shoe-laces";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-10-30-place-de-la-concorde.mdx": {
	id: "2005-10-30-place-de-la-concorde.mdx";
  slug: "2005-10-30-place-de-la-concorde";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-11-04-part-2.mdx": {
	id: "2005-11-04-part-2.mdx";
  slug: "2005-11-04-part-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-11-04-photo-album-imagemagick-part-1.mdx": {
	id: "2005-11-04-photo-album-imagemagick-part-1.mdx";
  slug: "2005-11-04-photo-album-imagemagick-part-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-11-10-diwali-at-paris.mdx": {
	id: "2005-11-10-diwali-at-paris.mdx";
  slug: "2005-11-10-diwali-at-paris";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-11-14-orsay-revisited.mdx": {
	id: "2005-11-14-orsay-revisited.mdx";
  slug: "2005-11-14-orsay-revisited";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-11-16-reached-10k-and-folding.mdx": {
	id: "2005-11-16-reached-10k-and-folding.mdx";
  slug: "2005-11-16-reached-10k-and-folding";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-11-18-create-banner-with-mirror-effect-by-imagemagick.mdx": {
	id: "2005-11-18-create-banner-with-mirror-effect-by-imagemagick.mdx";
  slug: "2005-11-18-create-banner-with-mirror-effect-by-imagemagick";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-11-25-create-typewriter-effect-with-ming-php-for-flash-swf-movie.mdx": {
	id: "2005-11-25-create-typewriter-effect-with-ming-php-for-flash-swf-movie.mdx";
  slug: "2005-11-25-create-typewriter-effect-with-ming-php-for-flash-swf-movie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-11-29-metro-in-paris.mdx": {
	id: "2005-11-29-metro-in-paris.mdx";
  slug: "2005-11-29-metro-in-paris";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-12-16-thank-god-its-friday.mdx": {
	id: "2005-12-16-thank-god-its-friday.mdx";
  slug: "2005-12-16-thank-god-its-friday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2005-12-28-happy-holidays.mdx": {
	id: "2005-12-28-happy-holidays.mdx";
  slug: "2005-12-28-happy-holidays";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-01-15-home-network-adsl-network-phone.mdx": {
	id: "2006-01-15-home-network-adsl-network-phone.mdx";
  slug: "2006-01-15-home-network-adsl-network-phone";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-01-17-joy-of-baking.mdx": {
	id: "2006-01-17-joy-of-baking.mdx";
  slug: "2006-01-17-joy-of-baking";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-02-05-french-classes-came-to-an-end.mdx": {
	id: "2006-02-05-french-classes-came-to-an-end.mdx";
  slug: "2006-02-05-french-classes-came-to-an-end";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-02-16-vacation-on-the-horizon.mdx": {
	id: "2006-02-16-vacation-on-the-horizon.mdx";
  slug: "2006-02-16-vacation-on-the-horizon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-03-06-tujh-bin.mdx": {
	id: "2006-03-06-tujh-bin.mdx";
  slug: "2006-03-06-tujh-bin";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-03-15-changing-face-of-india.mdx": {
	id: "2006-03-15-changing-face-of-india.mdx";
  slug: "2006-03-15-changing-face-of-india";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-04-20-back-to-mordor.mdx": {
	id: "2006-04-20-back-to-mordor.mdx";
  slug: "2006-04-20-back-to-mordor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-04-25-changing-face-of-india.mdx": {
	id: "2006-04-25-changing-face-of-india.mdx";
  slug: "2006-04-25-changing-face-of-india";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-05-04-add-new-administrator-and-management-post-for-smartdashboard-firewall-1.mdx": {
	id: "2006-05-04-add-new-administrator-and-management-post-for-smartdashboard-firewall-1.mdx";
  slug: "2006-05-04-add-new-administrator-and-management-post-for-smartdashboard-firewall-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-05-04-envy-me-if-you-can.mdx": {
	id: "2006-05-04-envy-me-if-you-can.mdx";
  slug: "2006-05-04-envy-me-if-you-can";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-05-10-deja-vu.mdx": {
	id: "2006-05-10-deja-vu.mdx";
  slug: "2006-05-10-deja-vu";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-05-12-friday-12th-may.mdx": {
	id: "2006-05-12-friday-12th-may.mdx";
  slug: "2006-05-12-friday-12th-may";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-05-18-load-cpu-memory-shell-script-c-program-for-quick-and-dirty-benchmark.mdx": {
	id: "2006-05-18-load-cpu-memory-shell-script-c-program-for-quick-and-dirty-benchmark.mdx";
  slug: "2006-05-18-load-cpu-memory-shell-script-c-program-for-quick-and-dirty-benchmark";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-05-21-sikkim-gangtok.mdx": {
	id: "2006-05-21-sikkim-gangtok.mdx";
  slug: "2006-05-21-sikkim-gangtok";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-05-22-uddan-flight.mdx": {
	id: "2006-05-22-uddan-flight.mdx";
  slug: "2006-05-22-uddan-flight";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-05-23-bike-route.mdx": {
	id: "2006-05-23-bike-route.mdx";
  slug: "2006-05-23-bike-route";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-06-04-le-marche.mdx": {
	id: "2006-06-04-le-marche.mdx";
  slug: "2006-06-04-le-marche";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-06-27-uncertain-voyage.mdx": {
	id: "2006-06-27-uncertain-voyage.mdx";
  slug: "2006-06-27-uncertain-voyage";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-02-cest-fou.mdx": {
	id: "2006-07-02-cest-fou.mdx";
  slug: "2006-07-02-cest-fou";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-12-cest-fou-part-ii.mdx": {
	id: "2006-07-12-cest-fou-part-ii.mdx";
  slug: "2006-07-12-cest-fou-part-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-15-lausanne-18th-june.mdx": {
	id: "2006-07-15-lausanne-18th-june.mdx";
  slug: "2006-07-15-lausanne-18th-june";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-15-post-bus-19th-june.mdx": {
	id: "2006-07-15-post-bus-19th-june.mdx";
  slug: "2006-07-15-post-bus-19th-june";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-15-rescued-19th-june.mdx": {
	id: "2006-07-15-rescued-19th-june.mdx";
  slug: "2006-07-15-rescued-19th-june";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-16-glacier-express-20th-june.mdx": {
	id: "2006-07-16-glacier-express-20th-june.mdx";
  slug: "2006-07-16-glacier-express-20th-june";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-16-hiking-mt-rigi-22nd-june.mdx": {
	id: "2006-07-16-hiking-mt-rigi-22nd-june.mdx";
  slug: "2006-07-16-hiking-mt-rigi-22nd-june";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-16-mount-jungfraujoch-23rd-june.mdx": {
	id: "2006-07-16-mount-jungfraujoch-23rd-june.mdx";
  slug: "2006-07-16-mount-jungfraujoch-23rd-june";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-16-mount-titlis-21st-june.mdx": {
	id: "2006-07-16-mount-titlis-21st-june.mdx";
  slug: "2006-07-16-mount-titlis-21st-june";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-16-relaxing-day-24th-june.mdx": {
	id: "2006-07-16-relaxing-day-24th-june.mdx";
  slug: "2006-07-16-relaxing-day-24th-june";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-18-golden-pass-montreux.mdx": {
	id: "2006-07-18-golden-pass-montreux.mdx";
  slug: "2006-07-18-golden-pass-montreux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-19-a-must-list-for-swiss.mdx": {
	id: "2006-07-19-a-must-list-for-swiss.mdx";
  slug: "2006-07-19-a-must-list-for-swiss";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-19-shhh-silence-please.mdx": {
	id: "2006-07-19-shhh-silence-please.mdx";
  slug: "2006-07-19-shhh-silence-please";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-26-yum.mdx": {
	id: "2006-07-26-yum.mdx";
  slug: "2006-07-26-yum";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-30-green-plate.mdx": {
	id: "2006-07-30-green-plate.mdx";
  slug: "2006-07-30-green-plate";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-31-baking-bread.mdx": {
	id: "2006-07-31-baking-bread.mdx";
  slug: "2006-07-31-baking-bread";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-07-31-taste-of-india-swiss.mdx": {
	id: "2006-07-31-taste-of-india-swiss.mdx";
  slug: "2006-07-31-taste-of-india-swiss";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-08-01-italian-aroma.mdx": {
	id: "2006-08-01-italian-aroma.mdx";
  slug: "2006-08-01-italian-aroma";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-08-04-swiss-itenary-tgv-and-gizmo.mdx": {
	id: "2006-08-04-swiss-itenary-tgv-and-gizmo.mdx";
  slug: "2006-08-04-swiss-itenary-tgv-and-gizmo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-08-11-last-week.mdx": {
	id: "2006-08-11-last-week.mdx";
  slug: "2006-08-11-last-week";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-08-12-pardey-key-pichey.mdx": {
	id: "2006-08-12-pardey-key-pichey.mdx";
  slug: "2006-08-12-pardey-key-pichey";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-08-28-door-code.mdx": {
	id: "2006-08-28-door-code.mdx";
  slug: "2006-08-28-door-code";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-08-28-making-of-chocolate-charlotte.mdx": {
	id: "2006-08-28-making-of-chocolate-charlotte.mdx";
  slug: "2006-08-28-making-of-chocolate-charlotte";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-08-30-last-days-in-paris.mdx": {
	id: "2006-08-30-last-days-in-paris.mdx";
  slug: "2006-08-30-last-days-in-paris";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-08-31-souvenir.mdx": {
	id: "2006-08-31-souvenir.mdx";
  slug: "2006-08-31-souvenir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-09-04-le-vol.mdx": {
	id: "2006-09-04-le-vol.mdx";
  slug: "2006-09-04-le-vol";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-09-30-few-books.mdx": {
	id: "2006-09-30-few-books.mdx";
  slug: "2006-09-30-few-books";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-10-10-aids-awareness-paris.mdx": {
	id: "2006-10-10-aids-awareness-paris.mdx";
  slug: "2006-10-10-aids-awareness-paris";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-10-16-back-to-work.mdx": {
	id: "2006-10-16-back-to-work.mdx";
  slug: "2006-10-16-back-to-work";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-10-23-durga-puja.mdx": {
	id: "2006-10-23-durga-puja.mdx";
  slug: "2006-10-23-durga-puja";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-10-30-lunch-time.mdx": {
	id: "2006-10-30-lunch-time.mdx";
  slug: "2006-10-30-lunch-time";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-11-28-local-trains-of-mumbai.mdx": {
	id: "2006-11-28-local-trains-of-mumbai.mdx";
  slug: "2006-11-28-local-trains-of-mumbai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-12-04-linen-anniversary.mdx": {
	id: "2006-12-04-linen-anniversary.mdx";
  slug: "2006-12-04-linen-anniversary";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-12-23-indian-newspapers.mdx": {
	id: "2006-12-23-indian-newspapers.mdx";
  slug: "2006-12-23-indian-newspapers";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2006-12-31-welcoming-2007.mdx": {
	id: "2006-12-31-welcoming-2007.mdx";
  slug: "2006-12-31-welcoming-2007";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-01-04-new-gadget-k790i.mdx": {
	id: "2007-01-04-new-gadget-k790i.mdx";
  slug: "2007-01-04-new-gadget-k790i";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-01-06-travel-under-terror.mdx": {
	id: "2007-01-06-travel-under-terror.mdx";
  slug: "2007-01-06-travel-under-terror";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-01-10-a-dark-post.mdx": {
	id: "2007-01-10-a-dark-post.mdx";
  slug: "2007-01-10-a-dark-post";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-01-13-another-weekend.mdx": {
	id: "2007-01-13-another-weekend.mdx";
  slug: "2007-01-13-another-weekend";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-01-16-zooomr-pro.mdx": {
	id: "2007-01-16-zooomr-pro.mdx";
  slug: "2007-01-16-zooomr-pro";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-01-21-micro-oft-launch-mumbai.mdx": {
	id: "2007-01-21-micro-oft-launch-mumbai.mdx";
  slug: "2007-01-21-micro-oft-launch-mumbai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-01-27-britania-irani-restaurant.mdx": {
	id: "2007-01-27-britania-irani-restaurant.mdx";
  slug: "2007-01-27-britania-irani-restaurant";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-02-07-wednesday-best-of-all-weekdays.mdx": {
	id: "2007-02-07-wednesday-best-of-all-weekdays.mdx";
  slug: "2007-02-07-wednesday-best-of-all-weekdays";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-02-14-saint-valentine-ii.mdx": {
	id: "2007-02-14-saint-valentine-ii.mdx";
  slug: "2007-02-14-saint-valentine-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-02-14-saint-valentine.mdx": {
	id: "2007-02-14-saint-valentine.mdx";
  slug: "2007-02-14-saint-valentine";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-02-18-a-day-break-harihareshwar.mdx": {
	id: "2007-02-18-a-day-break-harihareshwar.mdx";
  slug: "2007-02-18-a-day-break-harihareshwar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-03-10-nouvelle-in-market.mdx": {
	id: "2007-03-10-nouvelle-in-market.mdx";
  slug: "2007-03-10-nouvelle-in-market";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-03-21-mahabaleshwar-weekend-getaway.mdx": {
	id: "2007-03-21-mahabaleshwar-weekend-getaway.mdx";
  slug: "2007-03-21-mahabaleshwar-weekend-getaway";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-03-22-mahabaleshwar-day-ii.mdx": {
	id: "2007-03-22-mahabaleshwar-day-ii.mdx";
  slug: "2007-03-22-mahabaleshwar-day-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-04-mera-bharat-jawaan.mdx": {
	id: "2007-04-04-mera-bharat-jawaan.mdx";
  slug: "2007-04-04-mera-bharat-jawaan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-06-mumbaiya-lingo.mdx": {
	id: "2007-04-06-mumbaiya-lingo.mdx";
  slug: "2007-04-06-mumbaiya-lingo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-10-wordpress-bleeding-2-2-and-tag.mdx": {
	id: "2007-04-10-wordpress-bleeding-2-2-and-tag.mdx";
  slug: "2007-04-10-wordpress-bleeding-2-2-and-tag";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-13-little-visitor-at-office-window.mdx": {
	id: "2007-04-13-little-visitor-at-office-window.mdx";
  slug: "2007-04-13-little-visitor-at-office-window";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-14-viva-goa-day-2.mdx": {
	id: "2007-04-14-viva-goa-day-2.mdx";
  slug: "2007-04-14-viva-goa-day-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-14-viva-goa-preamble.mdx": {
	id: "2007-04-14-viva-goa-preamble.mdx";
  slug: "2007-04-14-viva-goa-preamble";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-16-viva-goa-day-3.mdx": {
	id: "2007-04-16-viva-goa-day-3.mdx";
  slug: "2007-04-16-viva-goa-day-3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-18-viva-goa-adios.mdx": {
	id: "2007-04-18-viva-goa-adios.mdx";
  slug: "2007-04-18-viva-goa-adios";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-04-18-viva-goa-day-4.mdx": {
	id: "2007-04-18-viva-goa-day-4.mdx";
  slug: "2007-04-18-viva-goa-day-4";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-05-02-w-questions-of-indian-life.mdx": {
	id: "2007-05-02-w-questions-of-indian-life.mdx";
  slug: "2007-05-02-w-questions-of-indian-life";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-05-16-china-rose.mdx": {
	id: "2007-05-16-china-rose.mdx";
  slug: "2007-05-16-china-rose";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-05-25-skittlish-theme-with-silk-icons-for-wordpress.mdx": {
	id: "2007-05-25-skittlish-theme-with-silk-icons-for-wordpress.mdx";
  slug: "2007-05-25-skittlish-theme-with-silk-icons-for-wordpress";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-05-30-hearty-healthy.mdx": {
	id: "2007-05-30-hearty-healthy.mdx";
  slug: "2007-05-30-hearty-healthy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-05-31-courtesy-still-in-mumbai.mdx": {
	id: "2007-05-31-courtesy-still-in-mumbai.mdx";
  slug: "2007-05-31-courtesy-still-in-mumbai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-06-04-udupi-thali.mdx": {
	id: "2007-06-04-udupi-thali.mdx";
  slug: "2007-06-04-udupi-thali";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-06-20-hue-of-the-sky.mdx": {
	id: "2007-06-20-hue-of-the-sky.mdx";
  slug: "2007-06-20-hue-of-the-sky";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-06-26-rainy-sunday.mdx": {
	id: "2007-06-26-rainy-sunday.mdx";
  slug: "2007-06-26-rainy-sunday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-06-28-amby-in-city-of-joy.mdx": {
	id: "2007-06-28-amby-in-city-of-joy.mdx";
  slug: "2007-06-28-amby-in-city-of-joy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-07-04-sweet-teeth.mdx": {
	id: "2007-07-04-sweet-teeth.mdx";
  slug: "2007-07-04-sweet-teeth";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-07-07-life-in-monsoon.mdx": {
	id: "2007-07-07-life-in-monsoon.mdx";
  slug: "2007-07-07-life-in-monsoon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-07-12-c-for-cab-and-cricket.mdx": {
	id: "2007-07-12-c-for-cab-and-cricket.mdx";
  slug: "2007-07-12-c-for-cab-and-cricket";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-07-16-cart-in-city-road.mdx": {
	id: "2007-07-16-cart-in-city-road.mdx";
  slug: "2007-07-16-cart-in-city-road";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-07-20-celebrations.mdx": {
	id: "2007-07-20-celebrations.mdx";
  slug: "2007-07-20-celebrations";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-07-22-bombay-international-airport.mdx": {
	id: "2007-07-22-bombay-international-airport.mdx";
  slug: "2007-07-22-bombay-international-airport";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-07-23-arrived-singapore.mdx": {
	id: "2007-07-23-arrived-singapore.mdx";
  slug: "2007-07-23-arrived-singapore";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-07-29-shop-till-you-drop.mdx": {
	id: "2007-07-29-shop-till-you-drop.mdx";
  slug: "2007-07-29-shop-till-you-drop";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-08-06-sale.mdx": {
	id: "2007-08-06-sale.mdx";
  slug: "2007-08-06-sale";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-08-09-exploring-bits-n-bites.mdx": {
	id: "2007-08-09-exploring-bits-n-bites.mdx";
  slug: "2007-08-09-exploring-bits-n-bites";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-08-14-exploring-bits-n-bites-ii.mdx": {
	id: "2007-08-14-exploring-bits-n-bites-ii.mdx";
  slug: "2007-08-14-exploring-bits-n-bites-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-08-20-back-from-trip.mdx": {
	id: "2007-08-20-back-from-trip.mdx";
  slug: "2007-08-20-back-from-trip";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-08-23-le-ciel.mdx": {
	id: "2007-08-23-le-ciel.mdx";
  slug: "2007-08-23-le-ciel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-08-28-thread-of-love.mdx": {
	id: "2007-08-28-thread-of-love.mdx";
  slug: "2007-08-28-thread-of-love";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-09-04-o-krishna.mdx": {
	id: "2007-09-04-o-krishna.mdx";
  slug: "2007-09-04-o-krishna";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-09-07-36th-week-as-passed-by.mdx": {
	id: "2007-09-07-36th-week-as-passed-by.mdx";
  slug: "2007-09-07-36th-week-as-passed-by";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-09-11-sweet-potato-dessert.mdx": {
	id: "2007-09-11-sweet-potato-dessert.mdx";
  slug: "2007-09-11-sweet-potato-dessert";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-09-16-festivity-begins.mdx": {
	id: "2007-09-16-festivity-begins.mdx";
  slug: "2007-09-16-festivity-begins";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-09-17-remembering-belgium.mdx": {
	id: "2007-09-17-remembering-belgium.mdx";
  slug: "2007-09-17-remembering-belgium";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-09-28-cabbies-of-mumbai.mdx": {
	id: "2007-09-28-cabbies-of-mumbai.mdx";
  slug: "2007-09-28-cabbies-of-mumbai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-10-17-calamity-of-mid-life-middle-class.mdx": {
	id: "2007-10-17-calamity-of-mid-life-middle-class.mdx";
  slug: "2007-10-17-calamity-of-mid-life-middle-class";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-10-29-sunsets-in-mumbai.mdx": {
	id: "2007-10-29-sunsets-in-mumbai.mdx";
  slug: "2007-10-29-sunsets-in-mumbai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-09-festival-of-lights.mdx": {
	id: "2007-11-09-festival-of-lights.mdx";
  slug: "2007-11-09-festival-of-lights";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-12-got-g-oogle-phone.mdx": {
	id: "2007-11-12-got-g-oogle-phone.mdx";
  slug: "2007-11-12-got-g-oogle-phone";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-12-playing-with-shutter-speed.mdx": {
	id: "2007-11-12-playing-with-shutter-speed.mdx";
  slug: "2007-11-12-playing-with-shutter-speed";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-15-my-baby-shower.mdx": {
	id: "2007-11-15-my-baby-shower.mdx";
  slug: "2007-11-15-my-baby-shower";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-19-fresh-tomato-soup.mdx": {
	id: "2007-11-19-fresh-tomato-soup.mdx";
  slug: "2007-11-19-fresh-tomato-soup";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-21-milan-and-lake-como.mdx": {
	id: "2007-11-21-milan-and-lake-como.mdx";
  slug: "2007-11-21-milan-and-lake-como";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-22-cinqueterre-mediterranean-nirvana.mdx": {
	id: "2007-11-22-cinqueterre-mediterranean-nirvana.mdx";
  slug: "2007-11-22-cinqueterre-mediterranean-nirvana";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-23-an-afteroon-at-pisa.mdx": {
	id: "2007-11-23-an-afteroon-at-pisa.mdx";
  slug: "2007-11-23-an-afteroon-at-pisa";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-24-florence.mdx": {
	id: "2007-11-24-florence.mdx";
  slug: "2007-11-24-florence";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-25-siena.mdx": {
	id: "2007-11-25-siena.mdx";
  slug: "2007-11-25-siena";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-26-half-day-at-florence-and-venice.mdx": {
	id: "2007-11-26-half-day-at-florence-and-venice.mdx";
  slug: "2007-11-26-half-day-at-florence-and-venice";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-27-venice-at-leisure.mdx": {
	id: "2007-11-27-venice-at-leisure.mdx";
  slug: "2007-11-27-venice-at-leisure";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-11-30-milan-shopping-trip-came-to-end.mdx": {
	id: "2007-11-30-milan-shopping-trip-came-to-end.mdx";
  slug: "2007-11-30-milan-shopping-trip-came-to-end";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-12-06-berlin-diary.mdx": {
	id: "2007-12-06-berlin-diary.mdx";
  slug: "2007-12-06-berlin-diary";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-12-07-berlin-diary-ii.mdx": {
	id: "2007-12-07-berlin-diary-ii.mdx";
  slug: "2007-12-07-berlin-diary-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2007-12-22-berlin-diary-potsdam.mdx": {
	id: "2007-12-22-berlin-diary-potsdam.mdx";
  slug: "2007-12-22-berlin-diary-potsdam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-01-29-an-announcement.mdx": {
	id: "2008-01-29-an-announcement.mdx";
  slug: "2008-01-29-an-announcement";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-02-01-indian-inglish.mdx": {
	id: "2008-02-01-indian-inglish.mdx";
  slug: "2008-02-01-indian-inglish";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-02-24-hebbal-lake.mdx": {
	id: "2008-02-24-hebbal-lake.mdx";
  slug: "2008-02-24-hebbal-lake";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-03-04-journey-to-motherhood.mdx": {
	id: "2008-03-04-journey-to-motherhood.mdx";
  slug: "2008-03-04-journey-to-motherhood";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-03-04-my-best-picture.mdx": {
	id: "2008-03-04-my-best-picture.mdx";
  slug: "2008-03-04-my-best-picture";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-03-07-first-month.mdx": {
	id: "2008-03-07-first-month.mdx";
  slug: "2008-03-07-first-month";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-03-13-geography-mismatch.mdx": {
	id: "2008-03-13-geography-mismatch.mdx";
  slug: "2008-03-13-geography-mismatch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-03-23-bhat-suar.mdx": {
	id: "2008-03-23-bhat-suar.mdx";
  slug: "2008-03-23-bhat-suar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-03-31-second-month.mdx": {
	id: "2008-03-31-second-month.mdx";
  slug: "2008-03-31-second-month";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-04-04-feeling-the-kicks.mdx": {
	id: "2008-04-04-feeling-the-kicks.mdx";
  slug: "2008-04-04-feeling-the-kicks";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-04-07-shiv-jayanti.mdx": {
	id: "2008-04-07-shiv-jayanti.mdx";
  slug: "2008-04-07-shiv-jayanti";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-04-12-nagaon-a-sleepy-sunday.mdx": {
	id: "2008-04-12-nagaon-a-sleepy-sunday.mdx";
  slug: "2008-04-12-nagaon-a-sleepy-sunday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-04-15-third-month.mdx": {
	id: "2008-04-15-third-month.mdx";
  slug: "2008-04-15-third-month";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-04-18-perfect-parking.mdx": {
	id: "2008-04-18-perfect-parking.mdx";
  slug: "2008-04-18-perfect-parking";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-04-22-fourth-month.mdx": {
	id: "2008-04-22-fourth-month.mdx";
  slug: "2008-04-22-fourth-month";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-05-02-goodbye-mumbai-a-quick-update.mdx": {
	id: "2008-05-02-goodbye-mumbai-a-quick-update.mdx";
  slug: "2008-05-02-goodbye-mumbai-a-quick-update";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-05-15-letter-to-my-son.mdx": {
	id: "2008-05-15-letter-to-my-son.mdx";
  slug: "2008-05-15-letter-to-my-son";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-05-20-our-sleeping-beauty.mdx": {
	id: "2008-05-20-our-sleeping-beauty.mdx";
  slug: "2008-05-20-our-sleeping-beauty";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-05-22-birth-of-a-mother-i.mdx": {
	id: "2008-05-22-birth-of-a-mother-i.mdx";
  slug: "2008-05-22-birth-of-a-mother-i";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-05-25-birth-of-a-mother-ii.mdx": {
	id: "2008-05-25-birth-of-a-mother-ii.mdx";
  slug: "2008-05-25-birth-of-a-mother-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-05-30-passion-of-reading.mdx": {
	id: "2008-05-30-passion-of-reading.mdx";
  slug: "2008-05-30-passion-of-reading";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-06-18-fifth-month.mdx": {
	id: "2008-06-18-fifth-month.mdx";
  slug: "2008-06-18-fifth-month";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-06-20-we-are-bangalore.mdx": {
	id: "2008-06-20-we-are-bangalore.mdx";
  slug: "2008-06-20-we-are-bangalore";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-07-17-bombay-to-bangalore-by-car-nh4.mdx": {
	id: "2008-07-17-bombay-to-bangalore-by-car-nh4.mdx";
  slug: "2008-07-17-bombay-to-bangalore-by-car-nh4";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-07-17-sixth-month.mdx": {
	id: "2008-07-17-sixth-month.mdx";
  slug: "2008-07-17-sixth-month";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-07-23-whatz-fresh-about-reliance-fresh.mdx": {
	id: "2008-07-23-whatz-fresh-about-reliance-fresh.mdx";
  slug: "2008-07-23-whatz-fresh-about-reliance-fresh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-08-07-rejuvenating-old-i-pod.mdx": {
	id: "2008-08-07-rejuvenating-old-i-pod.mdx";
  slug: "2008-08-07-rejuvenating-old-i-pod";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-08-26-seventh-month.mdx": {
	id: "2008-08-26-seventh-month.mdx";
  slug: "2008-08-26-seventh-month";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-08-28-extempo-performance.mdx": {
	id: "2008-08-28-extempo-performance.mdx";
  slug: "2008-08-28-extempo-performance";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-09-17-wish-pamela.mdx": {
	id: "2008-09-17-wish-pamela.mdx";
  slug: "2008-09-17-wish-pamela";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-10-29-long-time-no-see.mdx": {
	id: "2008-10-29-long-time-no-see.mdx";
  slug: "2008-10-29-long-time-no-see";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-11-13-as-time-flies.mdx": {
	id: "2008-11-13-as-time-flies.mdx";
  slug: "2008-11-13-as-time-flies";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-11-21-back-to-bangalore.mdx": {
	id: "2008-11-21-back-to-bangalore.mdx";
  slug: "2008-11-21-back-to-bangalore";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-11-21-change.mdx": {
	id: "2008-11-21-change.mdx";
  slug: "2008-11-21-change";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-12-01-wear-the-red-ribbon.mdx": {
	id: "2008-12-01-wear-the-red-ribbon.mdx";
  slug: "2008-12-01-wear-the-red-ribbon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-12-05-chocolate-banana-muffins.mdx": {
	id: "2008-12-05-chocolate-banana-muffins.mdx";
  slug: "2008-12-05-chocolate-banana-muffins";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-12-07-yelagiri.mdx": {
	id: "2008-12-07-yelagiri.mdx";
  slug: "2008-12-07-yelagiri";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-12-20-road-trip-to-mysore.mdx": {
	id: "2008-12-20-road-trip-to-mysore.mdx";
  slug: "2008-12-20-road-trip-to-mysore";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-12-21-little-tibet.mdx": {
	id: "2008-12-21-little-tibet.mdx";
  slug: "2008-12-21-little-tibet";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2008-12-22-madikeri-and-around.mdx": {
	id: "2008-12-22-madikeri-and-around.mdx";
  slug: "2008-12-22-madikeri-and-around";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-01-01-2008-mixed-bag.mdx": {
	id: "2009-01-01-2008-mixed-bag.mdx";
  slug: "2009-01-01-2008-mixed-bag";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-01-03-happy-new-year.mdx": {
	id: "2009-01-03-happy-new-year.mdx";
  slug: "2009-01-03-happy-new-year";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-02-03-joyeux-anniversaire-mon-petit.mdx": {
	id: "2009-02-03-joyeux-anniversaire-mon-petit.mdx";
  slug: "2009-02-03-joyeux-anniversaire-mon-petit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-02-10-lavazza-in-india.mdx": {
	id: "2009-02-10-lavazza-in-india.mdx";
  slug: "2009-02-10-lavazza-in-india";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-03-03-drive-to-heritage-site-lepakshi.mdx": {
	id: "2009-03-03-drive-to-heritage-site-lepakshi.mdx";
  slug: "2009-03-03-drive-to-heritage-site-lepakshi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-03-11-happy-holi.mdx": {
	id: "2009-03-11-happy-holi.mdx";
  slug: "2009-03-11-happy-holi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-03-23-ipl-2-0.mdx": {
	id: "2009-03-23-ipl-2-0.mdx";
  slug: "2009-03-23-ipl-2-0";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-04-12-visit-to-north-kerala-wayanad.mdx": {
	id: "2009-04-12-visit-to-north-kerala-wayanad.mdx";
  slug: "2009-04-12-visit-to-north-kerala-wayanad";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-04-13-wayanad-ii.mdx": {
	id: "2009-04-13-wayanad-ii.mdx";
  slug: "2009-04-13-wayanad-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-04-14-wayanad-iii.mdx": {
	id: "2009-04-14-wayanad-iii.mdx";
  slug: "2009-04-14-wayanad-iii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-05-08-gallerry-3-sneak-peak.mdx": {
	id: "2009-05-08-gallerry-3-sneak-peak.mdx";
  slug: "2009-05-08-gallerry-3-sneak-peak";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-05-09-coolie.mdx": {
	id: "2009-05-09-coolie.mdx";
  slug: "2009-05-09-coolie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-05-21-sondesh.mdx": {
	id: "2009-05-21-sondesh.mdx";
  slug: "2009-05-21-sondesh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-05-30-visit-to-ot.mdx": {
	id: "2009-05-30-visit-to-ot.mdx";
  slug: "2009-05-30-visit-to-ot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-06-24-aarush-swimming-pool.mdx": {
	id: "2009-06-24-aarush-swimming-pool.mdx";
  slug: "2009-06-24-aarush-swimming-pool";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-07-04-playing-football.mdx": {
	id: "2009-07-04-playing-football.mdx";
  slug: "2009-07-04-playing-football";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-07-21-depuis-longtemps.mdx": {
	id: "2009-07-21-depuis-longtemps.mdx";
  slug: "2009-07-21-depuis-longtemps";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-08-06-cost-cutting-travel-and-more.mdx": {
	id: "2009-08-06-cost-cutting-travel-and-more.mdx";
  slug: "2009-08-06-cost-cutting-travel-and-more";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-09-22-happy-durga-puja.mdx": {
	id: "2009-09-22-happy-durga-puja.mdx";
  slug: "2009-09-22-happy-durga-puja";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-09-27-new-widget-with-media-rss.mdx": {
	id: "2009-09-27-new-widget-with-media-rss.mdx";
  slug: "2009-09-27-new-widget-with-media-rss";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-10-15-madras-filter-coffee.mdx": {
	id: "2009-10-15-madras-filter-coffee.mdx";
  slug: "2009-10-15-madras-filter-coffee";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-10-18-shravanabelagola.mdx": {
	id: "2009-10-18-shravanabelagola.mdx";
  slug: "2009-10-18-shravanabelagola";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-10-26-another-year-passed-by.mdx": {
	id: "2009-10-26-another-year-passed-by.mdx";
  slug: "2009-10-26-another-year-passed-by";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-11-14-tonsuring-my-babys-head-tirupati.mdx": {
	id: "2009-11-14-tonsuring-my-babys-head-tirupati.mdx";
  slug: "2009-11-14-tonsuring-my-babys-head-tirupati";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-11-19-it-came-to-an-end.mdx": {
	id: "2009-11-19-it-came-to-an-end.mdx";
  slug: "2009-11-19-it-came-to-an-end";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-12-21-first-day-singapore.mdx": {
	id: "2009-12-21-first-day-singapore.mdx";
  slug: "2009-12-21-first-day-singapore";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2009-12-27-friday-black-peper-crab.mdx": {
	id: "2009-12-27-friday-black-peper-crab.mdx";
  slug: "2009-12-27-friday-black-peper-crab";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-10-29-des-vacances.mdx": {
	id: "2010-10-29-des-vacances.mdx";
  slug: "Week long trip to Rajasthan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-10-30-shekhawati-open-air-art-gallery.mdx": {
	id: "2010-10-30-shekhawati-open-air-art-gallery.mdx";
  slug: "2010-10-30-shekhawati-open-air-art-gallery";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-10-31-jaipur.mdx": {
	id: "2010-10-31-jaipur.mdx";
  slug: "2010-10-31-jaipur";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-11-01-jodhpur.mdx": {
	id: "2010-11-01-jodhpur.mdx";
  slug: "2010-11-01-jodhpur";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-11-02-jodhpur-ii.mdx": {
	id: "2010-11-02-jodhpur-ii.mdx";
  slug: "2010-11-02-jodhpur-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-11-04-jaisalmer.mdx": {
	id: "2010-11-04-jaisalmer.mdx";
  slug: "2010-11-04-jaisalmer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-11-05-ajmer-pushkar.mdx": {
	id: "2010-11-05-ajmer-pushkar.mdx";
  slug: "2010-11-05-ajmer-pushkar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-11-06-chokhi-dhani-jaipur.mdx": {
	id: "2010-11-06-chokhi-dhani-jaipur.mdx";
  slug: "2010-11-06-chokhi-dhani-jaipur";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-11-15-another-move.mdx": {
	id: "2010-11-15-another-move.mdx";
  slug: "2010-11-15-another-move";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-11-18-maro-des-rajasthan.mdx": {
	id: "2010-11-18-maro-des-rajasthan.mdx";
  slug: "2010-11-18-maro-des-rajasthan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-12-11-madurai.mdx": {
	id: "2010-12-11-madurai.mdx";
  slug: "2010-12-11-madurai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-12-13-rameshwaram.mdx": {
	id: "2010-12-13-rameshwaram.mdx";
  slug: "2010-12-13-rameshwaram";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-12-14-kanyakumari-where-the-seas-meet.mdx": {
	id: "2010-12-14-kanyakumari-where-the-seas-meet.mdx";
  slug: "2010-12-14-kanyakumari-where-the-seas-meet";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-12-15-kovalam-and-varkala-beach.mdx": {
	id: "2010-12-15-kovalam-and-varkala-beach.mdx";
  slug: "2010-12-15-kovalam-and-varkala-beach";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-12-16-malampuzzha.mdx": {
	id: "2010-12-16-malampuzzha.mdx";
  slug: "2010-12-16-malampuzzha";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-12-17-backwater-kumarakom.mdx": {
	id: "2010-12-17-backwater-kumarakom.mdx";
  slug: "2010-12-17-backwater-kumarakom";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2010-12-31-south-trip.mdx": {
	id: "2010-12-31-south-trip.mdx";
  slug: "2010-12-31-south-trip";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-01-17-chod-aaye-hum-woh-galiyan.mdx": {
	id: "2011-01-17-chod-aaye-hum-woh-galiyan.mdx";
  slug: "2011-01-17-chod-aaye-hum-woh-galiyan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-01-19-with-elephants-dubare.mdx": {
	id: "2011-01-19-with-elephants-dubare.mdx";
  slug: "2011-01-19-with-elephants-dubare";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-03-29-halebid-belur-living-with-past.mdx": {
	id: "2011-03-29-halebid-belur-living-with-past.mdx";
  slug: "2011-03-29-halebid-belur-living-with-past";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-03-30-chikmagalur.mdx": {
	id: "2011-03-30-chikmagalur.mdx";
  slug: "2011-03-30-chikmagalur";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-04-20-sleeper-class.mdx": {
	id: "2011-04-20-sleeper-class.mdx";
  slug: "2011-04-20-sleeper-class";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-06-28-father-day-thank-you-aarush.mdx": {
	id: "2011-06-28-father-day-thank-you-aarush.mdx";
  slug: "2011-06-28-father-day-thank-you-aarush";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-07-14-a-quick-post.mdx": {
	id: "2011-07-14-a-quick-post.mdx";
  slug: "2011-07-14-a-quick-post";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-08-31-munnar-in-monsoon.mdx": {
	id: "2011-08-31-munnar-in-monsoon.mdx";
  slug: "2011-08-31-munnar-in-monsoon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2011-09-23-a-small-nano-but-long-wait.mdx": {
	id: "2011-09-23-a-small-nano-but-long-wait.mdx";
  slug: "2011-09-23-a-small-nano-but-long-wait";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-03-04-anandhadam.mdx": {
	id: "2012-03-04-anandhadam.mdx";
  slug: "2012-03-04-anandhadam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-03-11-yercaud-march12.mdx": {
	id: "2012-03-11-yercaud-march12.mdx";
  slug: "2012-03-11-yercaud-march12";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-04-16-masinagudi.mdx": {
	id: "2012-04-16-masinagudi.mdx";
  slug: "2012-04-16-masinagudi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-04-19-a-magical-gateway-called-redhill.mdx": {
	id: "2012-04-19-a-magical-gateway-called-redhill.mdx";
  slug: "2012-04-19-a-magical-gateway-called-redhill";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-04-21-coonoor-acre-wild.mdx": {
	id: "2012-04-21-coonoor-acre-wild.mdx";
  slug: "2012-04-21-coonoor-acre-wild";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-10-02-road-trip-october-2012.mdx": {
	id: "2012-10-02-road-trip-october-2012.mdx";
  slug: "2012-10-02-road-trip-october-2012";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-10-13-hampi-history-carved-in-granite.mdx": {
	id: "2012-10-13-hampi-history-carved-in-granite.mdx";
  slug: "2012-10-13-hampi-history-carved-in-granite";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-10-15-aihole-and-patadkal.mdx": {
	id: "2012-10-15-aihole-and-patadkal.mdx";
  slug: "2012-10-15-aihole-and-patadkal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-10-16-badami-and-bijapur.mdx": {
	id: "2012-10-16-badami-and-bijapur.mdx";
  slug: "2012-10-16-badami-and-bijapur";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-10-17-bijapur-chitradurga.mdx": {
	id: "2012-10-17-bijapur-chitradurga.mdx";
  slug: "2012-10-17-bijapur-chitradurga";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-10-20-10-years-hitch.mdx": {
	id: "2012-10-20-10-years-hitch.mdx";
  slug: "2012-10-20-10-years-hitch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2012-10-27-mangalore.mdx": {
	id: "2012-10-27-mangalore.mdx";
  slug: "2012-10-27-mangalore";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-04-09-opinion-does-it-really-matter.mdx": {
	id: "2013-04-09-opinion-does-it-really-matter.mdx";
  slug: "2013-04-09-opinion-does-it-really-matter";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-06-04-bookshelf.mdx": {
	id: "2013-06-04-bookshelf.mdx";
  slug: "2013-06-04-bookshelf";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-06-07-handshake.mdx": {
	id: "2013-06-07-handshake.mdx";
  slug: "2013-06-07-handshake";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-06-24-aarush-nama.mdx": {
	id: "2013-06-24-aarush-nama.mdx";
  slug: "2013-06-24-aarush-nama";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-07-03-google-page-test-cloudflare-and-w3-total-cache.mdx": {
	id: "2013-07-03-google-page-test-cloudflare-and-w3-total-cache.mdx";
  slug: "2013-07-03-google-page-test-cloudflare-and-w3-total-cache";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-07-12-chennai-drhm.mdx": {
	id: "2013-07-12-chennai-drhm.mdx";
  slug: "2013-07-12-chennai-drhm";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-07-15-1st-class-sleeper.mdx": {
	id: "2013-07-15-1st-class-sleeper.mdx";
  slug: "2013-07-15-1st-class-sleeper";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-08-04-pipeline-road-run.mdx": {
	id: "2013-08-04-pipeline-road-run.mdx";
  slug: "2013-08-04-pipeline-road-run";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-08-28-blessed.mdx": {
	id: "2013-08-28-blessed.mdx";
  slug: "2013-08-28-blessed";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-09-05-indian-babus-govt-official.mdx": {
	id: "2013-09-05-indian-babus-govt-official.mdx";
  slug: "2013-09-05-indian-babus-govt-official";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-09-19-west-sikkim-hee-bermiok.mdx": {
	id: "2013-09-19-west-sikkim-hee-bermiok.mdx";
  slug: "2013-09-19-west-sikkim-hee-bermiok";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-09-30-mysore-half-marathon-2013.mdx": {
	id: "2013-09-30-mysore-half-marathon-2013.mdx";
  slug: "2013-09-30-mysore-half-marathon-2013";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-10-25-kurseong.mdx": {
	id: "2013-10-25-kurseong.mdx";
  slug: "2013-10-25-kurseong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-12-14-moving-away-from-self-hosting.mdx": {
	id: "2013-12-14-moving-away-from-self-hosting.mdx";
  slug: "2013-12-14-moving-away-from-self-hosting";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2013-12-18-php-iptcembed-gallery3-to-flickr.mdx": {
	id: "2013-12-18-php-iptcembed-gallery3-to-flickr.mdx";
  slug: "2013-12-18-php-iptcembed-gallery3-to-flickr";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-03-29-tanflora-our-own-keukenhof-around-bangalore.mdx": {
	id: "2014-03-29-tanflora-our-own-keukenhof-around-bangalore.mdx";
  slug: "2014-03-29-tanflora-our-own-keukenhof-around-bangalore";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-04-26-driving-himachal.mdx": {
	id: "2014-04-26-driving-himachal.mdx";
  slug: "2014-04-26-driving-himachal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-04-29-pacemakers.mdx": {
	id: "2014-04-29-pacemakers.mdx";
  slug: "2014-04-29-pacemakers";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-05-12-wow-what-a-coincidence.mdx": {
	id: "2014-05-12-wow-what-a-coincidence.mdx";
  slug: "2014-05-12-wow-what-a-coincidence";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-06-19-facebook-down-june-19th-2014.mdx": {
	id: "2014-06-19-facebook-down-june-19th-2014.mdx";
  slug: "2014-06-19-facebook-down-june-19th-2014";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-07-03-drhm-chennai-2014.mdx": {
	id: "2014-07-03-drhm-chennai-2014.mdx";
  slug: "2014-07-03-drhm-chennai-2014";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-07-17-indian-mobile-scene-and-future.mdx": {
	id: "2014-07-17-indian-mobile-scene-and-future.mdx";
  slug: "2014-07-17-indian-mobile-scene-and-future";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-07-21-instant-coffee-bundt-cake.mdx": {
	id: "2014-07-21-instant-coffee-bundt-cake.mdx";
  slug: "2014-07-21-instant-coffee-bundt-cake";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-09-02-airtel-hyderabad-half-marathon-2014.mdx": {
	id: "2014-09-02-airtel-hyderabad-half-marathon-2014.mdx";
  slug: "2014-09-02-airtel-hyderabad-half-marathon-2014";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-12-03-sharat-when-rains-give-way-to-the-early-autumn-with-blue-skies-mid-august-to-mid-october.mdx": {
	id: "2014-12-03-sharat-when-rains-give-way-to-the-early-autumn-with-blue-skies-mid-august-to-mid-october.mdx";
  slug: "2014-12-03-sharat-when-rains-give-way-to-the-early-autumn-with-blue-skies-mid-august-to-mid-october";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-12-07-what-a-saturday.mdx": {
	id: "2014-12-07-what-a-saturday.mdx";
  slug: "2014-12-07-what-a-saturday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2014-12-17-happy-baking-happy-holidays.mdx": {
	id: "2014-12-17-happy-baking-happy-holidays.mdx";
  slug: "2014-12-17-happy-baking-happy-holidays";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2015-06-08-half-early-update.mdx": {
	id: "2015-06-08-half-early-update.mdx";
  slug: "2015-06-08-half-early-update";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2015-08-26-gujarat-2011-map.mdx": {
	id: "2015-08-26-gujarat-2011-map.mdx";
  slug: "2015-08-26-gujarat-2011-map";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2015-08-31-43-seconds-and-counting.mdx": {
	id: "2015-08-31-43-seconds-and-counting.mdx";
  slug: "2015-08-31-43-seconds-and-counting";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2015-09-23-satara-hm-2015.mdx": {
	id: "2015-09-23-satara-hm-2015.mdx";
  slug: "2015-09-23-satara-hm-2015";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2015-11-25-cochin-full-marathon-2015.mdx": {
	id: "2015-11-25-cochin-full-marathon-2015.mdx";
  slug: "2015-11-25-cochin-full-marathon-2015";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2016-01-13-2016-planning.mdx": {
	id: "2016-01-13-2016-planning.mdx";
  slug: "2016-01-13-2016-planning";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2017-02-14-plan-for-2017.mdx": {
	id: "2017-02-14-plan-for-2017.mdx";
  slug: "2017-02-14-plan-for-2017";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2017-05-31-uttarakhand-prelude.mdx": {
	id: "2017-05-31-uttarakhand-prelude.mdx";
  slug: "2017-05-31-uttarakhand-prelude";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2017-06-20-day-1-drive-to-mussoorie.mdx": {
	id: "2017-06-20-day-1-drive-to-mussoorie.mdx";
  slug: "2017-06-20-day-1-drive-to-mussoorie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2017-09-13-day-2-dehradun-haridwar.mdx": {
	id: "2017-09-13-day-2-dehradun-haridwar.mdx";
  slug: "2017-09-13-day-2-dehradun-haridwar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2017-10-06-day-3-rishikesh.mdx": {
	id: "2017-10-06-day-3-rishikesh.mdx";
  slug: "2017-10-06-day-3-rishikesh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-18-north-east-2018-planning.mdx": {
	id: "2018-05-18-north-east-2018-planning.mdx";
  slug: "2018-05-18-north-east-2018-planning";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-19-day-1-maa-kamakhya-here-we-come.mdx": {
	id: "2018-05-19-day-1-maa-kamakhya-here-we-come.mdx";
  slug: "2018-05-19-day-1-maa-kamakhya-here-we-come";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-21-day-2-shillong.mdx": {
	id: "2018-05-21-day-2-shillong.mdx";
  slug: "2018-05-21-day-2-shillong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-22-day-3-long-day-long-drive-crazy-one-meghalaya.mdx": {
	id: "2018-05-22-day-3-long-day-long-drive-crazy-one-meghalaya.mdx";
  slug: "2018-05-22-day-3-long-day-long-drive-crazy-one-meghalaya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-23-tiring-yet-happy-day-double-decker-root-bridge.mdx": {
	id: "2018-05-23-tiring-yet-happy-day-double-decker-root-bridge.mdx";
  slug: "2018-05-23-tiring-yet-happy-day-double-decker-root-bridge";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-24-sight-seeing-sohra-cherrapunjee.mdx": {
	id: "2018-05-24-sight-seeing-sohra-cherrapunjee.mdx";
  slug: "2018-05-24-sight-seeing-sohra-cherrapunjee";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-25-day-1-in-kaziranga-april-2018.mdx": {
	id: "2018-05-25-day-1-in-kaziranga-april-2018.mdx";
  slug: "2018-05-25-day-1-in-kaziranga-april-2018";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-26-second-day-in-kaziranga-april-2018.mdx": {
	id: "2018-05-26-second-day-in-kaziranga-april-2018.mdx";
  slug: "2018-05-26-second-day-in-kaziranga-april-2018";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-05-27-kaziranga-information-you-need-to-know-before-visiting.mdx": {
	id: "2018-05-27-kaziranga-information-you-need-to-know-before-visiting.mdx";
  slug: "2018-05-27-kaziranga-information-you-need-to-know-before-visiting";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-06-03-a-morning-at-hoollongapar-gibbon-sanctuary.mdx": {
	id: "2018-06-03-a-morning-at-hoollongapar-gibbon-sanctuary.mdx";
  slug: "2018-06-03-a-morning-at-hoollongapar-gibbon-sanctuary";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-06-04-gibbon-wildlife-things-to-know-before-vising.mdx": {
	id: "2018-06-04-gibbon-wildlife-things-to-know-before-vising.mdx";
  slug: "2018-06-04-gibbon-wildlife-things-to-know-before-vising";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-06-05-sivasagar-unexplored-ahom-kingdoms-finest.mdx": {
	id: "2018-06-05-sivasagar-unexplored-ahom-kingdoms-finest.mdx";
  slug: "2018-06-05-sivasagar-unexplored-ahom-kingdoms-finest";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-06-20-majuli-day-1-april-2018.mdx": {
	id: "2018-06-20-majuli-day-1-april-2018.mdx";
  slug: "2018-06-20-majuli-day-1-april-2018";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-06-21-majuli-day-2-april-2018.mdx": {
	id: "2018-06-21-majuli-day-2-april-2018.mdx";
  slug: "2018-06-21-majuli-day-2-april-2018";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-06-22-majuli-day-3-april-2018.mdx": {
	id: "2018-06-22-majuli-day-3-april-2018.mdx";
  slug: "2018-06-22-majuli-day-3-april-2018";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2018-10-16-kerala-2018-thekkady-and-thattekad.mdx": {
	id: "2018-10-16-kerala-2018-thekkady-and-thattekad.mdx";
  slug: "2018-10-16-kerala-2018-thekkady-and-thattekad";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-04-01-Bats-by-Aarush.mdx": {
	id: "2020-04-01-Bats-by-Aarush.mdx";
  slug: "2020-04-01-bats-by-aarush";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-04-01-Chamleon-by-Aarush.mdx": {
	id: "2020-04-01-Chamleon-by-Aarush.mdx";
  slug: "2020-04-01-chamleon-by-aarush";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-04-01-Falcon-by-Aarush.mdx": {
	id: "2020-04-01-Falcon-by-Aarush.mdx";
  slug: "2020-04-01-falcon-by-aarush";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-04-09-a-paradise-poem.mdx": {
	id: "2020-04-09-a-paradise-poem.mdx";
  slug: "2020-04-09-a-paradise-poem";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-04-11-jungle-poem.mdx": {
	id: "2020-04-11-jungle-poem.mdx";
  slug: "2020-04-11-jungle-poem";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-08-17-Independence-Day-poem.mdx": {
	id: "2020-08-17-Independence-Day-poem.mdx";
  slug: "2020-08-17-independence-day-poem";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-01-03-my-grandmother-house.mdx": {
	id: "2021-01-03-my-grandmother-house.mdx";
  slug: "2021-01-03-my-grandmother-house";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-01-17-Birding-at-Durg.mdx": {
	id: "2021-01-17-Birding-at-Durg.mdx";
  slug: "2021-01-17-birding-at-durg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-02-22-Drive-Bangalore-2-Durg.mdx": {
	id: "2021-02-22-Drive-Bangalore-2-Durg.mdx";
  slug: "2021-02-22-drive-bangalore-2-durg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-02-22-Onakona-Chhattisgarh.mdx": {
	id: "2021-02-22-Onakona-Chhattisgarh.mdx";
  slug: "2021-02-22-onakona-chhattisgarh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-06-23-My-Sourdough-Journey-in-lockdown.mdx": {
	id: "2021-06-23-My-Sourdough-Journey-in-lockdown.mdx";
  slug: "2021-06-23-my-sourdough-journey-in-lockdown";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-06-24-My-Baking-Tins-and-Pots.mdx": {
	id: "2021-06-24-My-Baking-Tins-and-Pots.mdx";
  slug: "2021-06-24-my-baking-tins-and-pots";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-06-24-My-Sourdough-Tools.mdx": {
	id: "2021-06-24-My-Sourdough-Tools.mdx";
  slug: "2021-06-24-my-sourdough-tools";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-08-31-Puducherry.mdx": {
	id: "2021-08-31-Puducherry.mdx";
  slug: "2021-08-31-puducherry";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-09-29-Udupi.mdx": {
	id: "2021-09-29-Udupi.mdx";
  slug: "2021-09-29-udupi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-10-22-Poem-Humanity.mdx": {
	id: "2021-10-22-Poem-Humanity.mdx";
  slug: "2021-10-22-poem-humanity";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-10-25-Plan-for-Udaipur.mdx": {
	id: "2021-10-25-Plan-for-Udaipur.mdx";
  slug: "2021-10-25-plan-for-udaipur";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-10-26-Jawai-Bera-land-of-Leopard.mdx": {
	id: "2021-10-26-Jawai-Bera-land-of-Leopard.mdx";
  slug: "2021-10-26-jawai-bera-land-of-leopard";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-10-27-Ranakpur.mdx": {
	id: "2021-10-27-Ranakpur.mdx";
  slug: "2021-10-27-ranakpur";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-11-11-sandakphu-trek.mdx": {
	id: "2021-11-11-sandakphu-trek.mdx";
  slug: "2021-11-11-sandakphu-trek";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-04-11-Day-1-Kashmir.mdx": {
	id: "2022-04-11-Day-1-Kashmir.mdx";
  slug: "2022-04-11-day-1-kashmir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-04-12-Day-2-Kashmir.mdx": {
	id: "2022-04-12-Day-2-Kashmir.mdx";
  slug: "2022-04-12-day-2-kashmir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-04-13-Day-3-Kashmir.mdx": {
	id: "2022-04-13-Day-3-Kashmir.mdx";
  slug: "2022-04-13-day-3-kashmir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-04-14-Day-4-Kashmir.mdx": {
	id: "2022-04-14-Day-4-Kashmir.mdx";
  slug: "2022-04-14-day-4-kashmir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-04-15-Day-5-Kashmir.mdx": {
	id: "2022-04-15-Day-5-Kashmir.mdx";
  slug: "2022-04-15-day-5-kashmir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-04-16-Day-6-Kashmir.mdx": {
	id: "2022-04-16-Day-6-Kashmir.mdx";
  slug: "2022-04-16-day-6-kashmir";
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
"2023-10-13-rajasthan.mdx": {
	id: "2023-10-13-rajasthan.mdx";
  slug: "2023-10-13-rajasthan";
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

	type ContentConfig = typeof import("./..\src\content\config.js");
}
