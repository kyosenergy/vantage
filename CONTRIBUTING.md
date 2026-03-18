# Contributing to Vantage

Contributions are **welcome** and will be fully **credited**.

Please read and understand the contribution guide before creating an issue or pull request.

## Etiquette

This project is open source, and as such, the maintainers give their free time to build and maintain the source code held within. They make the code freely available in the hope that it will be of use to other developers. It would be extremely unfair for them to suffer abuse or anger for their hard work.

Please be considerate towards maintainers when raising issues or presenting pull requests. Let's show the world that developers are civilized and selfless people.

It's the duty of the maintainer to ensure that all submissions to the project are of sufficient quality to benefit the project. Many developers have different skillsets, strengths, and weaknesses. Respect the maintainer's decision, and do not be upset or abusive if your submission is not used.

## Viability

When requesting or submitting new features, first consider whether it might be useful to others. Open source projects are used by many developers, who may have entirely different needs to your own. Think about whether or not your feature is likely to be used by other users of the project.

## Procedure

Before filing an issue:

- Attempt to replicate the problem, to ensure that it wasn't a coincidental incident.
- Check to make sure your feature suggestion isn't already present within the project.
- Check the pull requests tab to ensure that the bug doesn't have a fix in progress.
- Check the pull requests tab to ensure that the feature isn't already in progress.

Before submitting a pull request:

- Check the codebase to ensure that your feature doesn't already exist.
- Check the pull requests to ensure that another person hasn't already submitted the feature or fix.

## Requirements

If the project maintainer has any additional requirements, you will find them listed here.

- **[PSR-12 Coding Standard](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-12-extended-coding-style-guide.md)** - The easiest way to apply the conventions is to run `composer format`, which uses [Laravel Pint](https://laravel.com/docs/pint).

- **Add tests!** - Your patch won't be accepted if it doesn't have tests.

- **Document any change in behaviour** - Make sure the `README.md` and any other relevant documentation are kept up-to-date.

- **Consider our release cycle** - We try to follow [SemVer v2.0.0](https://semver.org/). Randomly breaking public APIs is not an option.

- **One pull request per feature** - If you want to do more than one thing, send multiple pull requests.

- **Send coherent history** - Make sure each individual commit in your pull request is meaningful. If you had to make multiple intermediate commits while developing, please [squash them](https://www.git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Changing-Multiple-Commit-Messages) before submitting.

## Running Tests

```bash
composer test
```

## Static Analysis

```bash
composer analyse
```

## Code Style

```bash
composer format
```

## Building Frontend Assets

The dashboard is built with Vue 3 and Bootstrap 5, and uses Vite for bundling. When you make changes to Vue components or SASS files, you need to rebuild the assets.

### Install Dependencies

```bash
npm install
```

### Build Assets (Production)

```bash
npm run build
```

This will compile all Vue components and SASS files to the `dist/` directory. The compiled assets are embedded as inline JavaScript and CSS in the Blade view, following the same approach as Laravel Horizon.

### Development Mode (Watch for Changes)

```bash
npm run watch
```

This will automatically rebuild assets when you make changes to files in `resources/`.

### Important Notes

- Always run `npm run build` before committing changes to Vue components or SASS files
- The `dist/` directory should be committed to the repository (it's used by package consumers)
- Contributors do NOT need to rebuild unless they modify `resources/js/` or `resources/sass/` files
- If you encounter build errors, try running `npm install` to ensure all dependencies are installed

## Project Structure

- `resources/js/app.js` - Vue 3 application entry point
- `resources/js/screens/` - Page components (Dashboard, Jobs, etc.)
- `resources/js/routes.js` - Vue Router configuration
- `resources/sass/` - SASS stylesheets (light and dark themes)
- `dist/` - Compiled assets (committed to repo)
- `vite.config.js` - Vite build configuration

**Happy coding**!

