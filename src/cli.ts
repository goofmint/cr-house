import { Command } from 'commander';

const program = new Command();

program
  .name('cr-house')
  .description('Generate CodeRabbit configuration for your repository')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize CodeRabbit configuration')
  .option('--output <path>', 'output file path', '.coderabbit.yaml')
  .option('--no-interactive', 'run in non-interactive mode')
  .action(async (options: { output: string; interactive: boolean }) => {
    const { init } = await import('./commands/init.js');
    await init(options);
  });

program.parse();
