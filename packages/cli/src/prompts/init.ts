// packages/cli/src/commands/new.ts
import { run, createRunnerConfig } from '@adenta/core/run'
import { intro, text, select, confirm } from '@clack/prompts';
import type { ProjectOptions } from '../types/index.js';
import { InvalidOptionArgumentError, type Command } from 'commander';
import { dirname, basename, resolve, join } from 'pathe';
import pc from 'picocolors'

const validateName = (value: string) => {
    if (!value) return 'Project name is required';
    if (!/^[a-zA-Z0-9-_/@.]+$/.test(value)) {
        return 'Project name can only contain \'@\', letters, numbers, hyphens, underscores, and forward slashes';
    }
    return;
}


/**
 * Separates a string into directory path and project name
 * @param {string} input - The input string (e.g., "Dev/app/my-project" or "my-project")
 * @returns {Object} - Object containing directory, name, and fullPath
 */
export const createProjectPath = (input: string) => {
    function separatePathAndName() {
        const directory = dirname(input);
        const name = basename(input);
        const fullPath = resolve(input);
        // Get relative directory (handle case where dirname returns '.')
        const relativeDirectory = directory === '.' ? '' : directory;

        return {
            directory: relativeDirectory,
            name: name,
            fullPath: fullPath,
            projectPath: resolve(join(relativeDirectory, name))
        };
    }

    const { directory, name, projectPath } = separatePathAndName();

    // If there's a directory, join it with the name
    if (directory) {
        return {
            name,
            targetDirectory: resolve(directory),
            projectPath
        };
    } else {
        // If no directory, create in current directory
        return {
            name,
            targetDirectory: resolve('.'),
            projectPath: resolve(name)
        };
    }
}

export const validateProjectName = (val?: string) => {
    if (!val) return;
    const validation = validateName(val);
    if (validation) throw new InvalidOptionArgumentError(validation);
    return val;
}

async function prompts(options: ProjectOptions, command: Command) {
    console.clear()
    intro(pc.bgCyan('\n Adenta Framework '));

    const projectName = options.dir || await text({
        message: 'What is your project name?',
        placeholder: 'my-adenta-app',
        validate: validateName
    }) as string;

    const template = options.template || await select({
        message: 'Which template would you like to use?',
        options: [
            { value: 'blank', label: 'CMS', hint: 'Base Setup without Supabase' },
            { value: 'website', label: 'Website', hint: 'Website + (CMS + SUPABASE)' },
            { value: 'ecommerce', label: 'Basic UI', hint: 'Ecommerce Site + (CMS+SUPABASE)' },
            { value: 'admin', label: 'Admin', hint: 'Admin Dashboard + CMS + Supabase' }
        ]
    }) as ProjectOptions['template'];

    const useSupabase = (
        (options.supabase === undefined || options.template === "blank") ?
            await confirm({
                message: 'Do you want to set up Supabase?',
                initialValue: true
            }) : options.supabase) as boolean;

    const {
        name,
        targetDirectory
    } = createProjectPath(projectName);

    const answers: ProjectOptions = {
        dir: targetDirectory,
        name,
        template: template,
        supabase: useSupabase
    };

    const { target, context } = createRunnerConfig('build', name);
    console.log(answers)

    await run(target, context)

}

export default prompts;