// {
//     "plugins": ["prettier-plugin-tailwindcss"]
// }
// .prettierrc.mjs
/** @type {import("prettier").Config} 
 * https://github.com/withastro/prettier-plugin-astro#readme
*/
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};