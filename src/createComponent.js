const inquirer = require('inquirer');
const config = require('./config').createComponent;
const fs = require('fs-extra');
const { hasArgs } = require('./args');

let targetModule = 'component';
if (hasArgs('atom')) {
  targetFolder = 'atoms';
  targetModule = 'atom'
} else if (hasArgs('molecule')) {
  targetFolder = 'molecules';
  targetModule = 'molecule'
}

const questions = [
  {
    message: `Enter ${targetModule} name\nRules: \n1. Name should start with capital or small case\n2. Name should not start with a number\n3. Name can contain an underscore\n:`,
    name: "componentName",
    type: "input"
  }
];

function createComponent(name) {
  // Create folder structure
  let componentPath = `${config.componentsFolder}/${name.toLowerCase()}`;
  if (hasArgs('atom')) {
    componentPath = `${config.atomsFolder}/${name.toLowerCase()}`;
  } else if (hasArgs('molecule')) {
    componentPath = `${config.moleculesFolder}/${name.toLowerCase()}`;
  }
  fs.mkdirsSync(componentPath);
  // Create files
  fs.writeFileSync(`${componentPath}/_${name}.scss`, '');
  const templateFileName = name.toLowerCase();
  fs.writeFileSync(`${componentPath}/${templateFileName}-template.html`, `<sly data-sly-template.${templateFileName}_template="$\{@ data, flag\}"></sly>`);
  if (!(hasArgs('atom') || hasArgs('molecule'))) {
    const jsFileName = `${name.charAt(0).toUpperCase()}${name.substring(1)}`;
    const instanceName = `${name.charAt(0).toLowerCase()}${name.substring(1)}`;
    fs.writeFileSync(`${componentPath}/${jsFileName}.js`, fs.readFileSync(config.componentTemplate, 'utf8').replace(/#component#/g, jsFileName));
    fs.writeFileSync(`${componentPath}/${jsFileName}.spec.js`, fs.readFileSync(config.testTemplate, 'utf8').replace(/#component#/g, jsFileName).replace(/#instance#/g, instanceName));
    fs.writeFileSync(`${componentPath}/ux-model.json`, '{}');
    const previewHtml = fs.readFileSync(config.pageTemplate, 'utf8').replace(/#name#/g, templateFileName);
    fs.writeFileSync(`${componentPath}/ux-preview.hbs`, previewHtml);
  }
  console.log('\x1b[32m%s\x1b[0m', `${targetModule} ${name} has been created!`);
}

inquirer.prompt(questions)
  .then(({ componentName }) => {
    if (
      componentName
      && !(/^\d|[^A-Za-z0-9_]/).test(componentName)
    ) {
      // Check if component already exists
      try {
        let folder = config.componentsFolder;
        let moduleName = 'Component';
        if (hasArgs('atom')) {
          folder = config.atomsFolder;
          moduleName = 'Atom';
        } else if (hasArgs('molecule')) {
          folder = config.moleculesFolder;
          moduleName = 'Molecule';
        }
        if (!fs.existsSync(folder)) {
          fs.mkdirsSync(folder);
        }
        const componentList = fs.readdirSync(folder);
        if (componentList.includes(componentName)) {
          console.log('\x1b[31m%s\x1b[0m', `${moduleName} with name ${componentName} already exists!`);
        } else {
          createComponent(componentName);
        }
      } catch (e) {
        console.log(e);
        console.log('\x1b[31m%s\x1b[0m', 'Something went wrong!');
      }
    } else {
      console.log('\x1b[31m%s\x1b[0m', 'You need to provide a valid component name');
    }
  })
  .catch(() => {
    console.log('\x1b[31m%s\x1b[0m', 'Something went wrong!');
  });
