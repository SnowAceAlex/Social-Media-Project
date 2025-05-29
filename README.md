# GitDiagram Class Diagram Generator

This project uses GitDiagram to automatically generate class diagrams from your codebase. GitDiagram is a powerful tool that helps visualize your code structure through UML class diagrams.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git

## Installation

1. Install GitDiagram globally:

```bash
npm install -g gitdiagram
```

2. Clone this repository:

```bash
git clone <your-repository-url>
cd <repository-name>
```

## Usage

### Basic Usage

To generate a class diagram from your codebase:

```bash
gitdiagram generate
```

This will create a class diagram based on your current codebase structure.

### Advanced Options

You can customize the diagram generation with various options:

```bash
gitdiagram generate --output=diagram.png --format=png --depth=2
```

Available options:

- `--output`: Specify the output file name
- `--format`: Choose output format (png, svg, pdf)
- `--depth`: Set the depth of class relationships to show
- `--exclude`: Exclude specific directories or files
- `--include`: Include only specific directories or files

### Configuration File

Create a `.gitdiagramrc` file in your project root to customize the diagram generation:

```json
{
  "output": "docs/class-diagram.png",
  "format": "png",
  "depth": 2,
  "exclude": ["node_modules", "dist", "tests"],
  "include": ["src"],
  "theme": "default"
}
```

## Best Practices

1. **Keep Your Code Clean**: Well-structured code will result in clearer diagrams
2. **Use Meaningful Names**: Class and method names should be descriptive
3. **Document Your Code**: Add JSDoc comments to improve diagram readability
4. **Regular Updates**: Generate diagrams regularly to keep documentation up-to-date

## Example

Here's an example of how your class diagram might look:

```
+----------------+       +----------------+
|     User       |       |    Post        |
+----------------+       +----------------+
| -id: string    |       | -id: string    |
| -name: string  |       | -title: string |
| -email: string |       | -content: string|
+----------------+       +----------------+
| +create()      |       | +create()      |
| +update()      |       | +update()      |
| +delete()      |       | +delete()      |
+----------------+       +----------------+
        |                       |
        |                       |
        v                       v
+----------------+       +----------------+
|   Comment      |       |    Like        |
+----------------+       +----------------+
| -id: string    |       | -id: string    |
| -content: string|      | -userId: string|
+----------------+       +----------------+
| +create()      |       | +create()      |
| +delete()      |       | +delete()      |
+----------------+       +----------------+
```

## Troubleshooting

Common issues and solutions:

1. **Diagram not generating**

   - Ensure you're in the correct directory
   - Check if GitDiagram is properly installed
   - Verify your code structure is valid

2. **Missing classes in diagram**

   - Check your include/exclude patterns
   - Verify class relationships are properly defined
   - Ensure files are tracked by Git

3. **Poor diagram quality**
   - Adjust the depth parameter
   - Clean up your code structure
   - Use more descriptive class names

## Contributing

Feel free to contribute to this project by:

1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and feature requests, please create an issue in the repository.
