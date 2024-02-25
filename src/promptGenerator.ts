import * as fs from 'fs';
import * as path from 'path';

export function generateProjectPrompt(rootPath: string | undefined): string {
    if (!rootPath) {
        return 'No project open.';
    }

    let projectStructure = getProjectStructure(rootPath);
    return `Prompt based on project: ${projectStructure}`;
}

function getProjectStructure(dirPath: string, prefix: string = ''): string {
    let structure = '';
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            structure += `${prefix}${file}/\n`;
            structure += getProjectStructure(filePath, prefix + '  ');
        } else {
            structure += `${prefix}${file}\n`;
        }
    }

    return structure;
}
