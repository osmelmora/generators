const COMPONENT_CHOICES = {
  STATELESS: 'Stateless Function',
  PURE: 'React.PureComponent',
  COMPONENT: 'React.Component',
};

const validateRequiredName = value =>
  /.+/.test(value) ? true : 'The name is required';

module.exports = {
  description: 'Add an unconnected component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'select the type of the component',
      default: COMPONENT_CHOICES.STATELESS,
      choices() {
        return [
          COMPONENT_CHOICES.STATELESS,
          COMPONENT_CHOICES.COMPONENT,
          COMPONENT_CHOICES.PURE,
        ];
      },
    },
    {
      type: 'input',
      name: 'componentName',
      message: 'What should it be called?',
      default: 'Button',
      validate: validateRequiredName,
    },
    {
      type: 'input',
      name: 'moduleName',
      message: 'What should it be the parent module?',
      default: 'general',
      validate: validateRequiredName,
    },
    {
      type: 'confirm',
      name: 'wantFlow',
      default: true,
      message: 'Do you want flow?',
    },
  ],
  actions(data) {
    const componentTemplateFile =
      data.type === COMPONENT_CHOICES.STATELESS
        ? './component/stateless.js.hbs'
        : './component/class.js.hbs';

    return [
      {
        type: 'add',
        path:
          '../src/modules/{{moduleName}}/{{properCase componentName}}/index.js',
        templateFile: './component/index.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path:
          '../src/modules/{{moduleName}}/{{properCase componentName}}/component.js',
        templateFile: componentTemplateFile,
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../src/modules/{{moduleName}}/index.js',
        templateFile: './component/export.js.hbs',
        pattern: /(export\s\{\s(\w+)\s\}\sfrom\s'\.\/(\w+)';\n)(?!.*export\s\{\s(\w+)\s\}\sfrom\s'\.\/(\w+)';)/g,
        abortOnFail: true,
      },
    ];
  },
};
