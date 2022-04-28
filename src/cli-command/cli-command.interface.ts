export interface CliCommandInterface {
  readonly name: string;
  execute(...params: string[]): Promise<void>;
}
