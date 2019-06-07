const { wizard } = require('./ask');
const xml2js = require('xml2js');
const fs = require('fs-extra');
const xmlParser = new xml2js.Parser();
const affiliateTemplates = require('./affiliateTemplates');
let configTemplate = require('./config-template.json');
let questions = [];
let configData = {};

function _addQuestions() {
  questions.push(
    {
      question: 'Artifact ID',
      key: 'rootArtifactId'
    },
    {
      question: 'Brand',
      key: 'brand'
    },
    {
      question: 'Sub brand',
      key: 'subBrand'
    }
  );
}

function _copyBlueprintFiles(blueprints) {
  try {
    blueprints.forEach(blueprint => {
      // Get the list of files and folders to be copied
      const content = fs.readdirSync(blueprint.blueprint);
      if (content.length) {
        content.forEach(file => {
          const destFile = `${blueprint.dest}/${file}`;
          if (!fs.existsSync(destFile)) {
            fs.copySync(`${blueprint.blueprint}/${file}`, destFile);
          }
        });
      }
    });
  } catch (e) {
    console.log('Some problem occurred in copying blueprint files');
    console.log(e);
  }
}

function _generateRootProject(config) {
  const blueprints = [];
  // Create demo content folder
  if (!fs.existsSync(config.demoFolder)) {
    console.log('==== Creating demo content folder ====');
    fs.mkdirsSync(config.demoFolder);
    console.log('==== Demo content folder created ====');
    // Create css clientlibs templates
    console.log('==== Creating SCSS clientlibs configuration ====');
    Object.keys(config.scss.clientlibs).forEach(clientlib => {
      const clientLibOb = config.scss.clientlibs[clientlib];
      let clientLibPath = '';
      let contentXmlFormat = affiliateTemplates.templates['.content.xml'].join('\n');
      let cssTxtFormat = affiliateTemplates.templates['css.txt'].join('\n').replace('{filename}', clientlib);
      let blueprintDestPath = `${config.assetFolder}/styles`;
      if (clientLibOb.processRegions) {
        clientLibPath = `${config.demoFolder}/${config.scss.defaultRegionCode}/${clientlib}.publish`;
        contentXmlFormat = contentXmlFormat.replace('{category}', `${clientlib}.publish.${config.scss.defaultRegionCode.split('/').join('.')}`);
        blueprintDestPath = `${blueprintDestPath}/${config.scss.defaultRegionCode}`;
      } else {
        clientLibPath = `${config.demoFolder}/${clientlib}.publish`;
        contentXmlFormat = contentXmlFormat.replace('{category}', `${clientlib}.publish`);
      }
      if (clientLibOb.hasBlueprint) {
        blueprints.push({
          blueprint: `blueprints/${clientlib}`,
          dest: blueprintDestPath
        });
      }
      console.log(`==== Creating:: ${clientLibPath} ====`);
      fs.mkdirsSync(clientLibPath);
      console.log(`==== Created:: ${clientLibPath} ====`);
      // Create .content.xml file and css.txt
      console.log('==== Writing .content.xml ====');
      fs.writeFileSync(`${clientLibPath}/.content.xml`, contentXmlFormat);
      console.log('==== Writing css.txt ====');
      fs.writeFileSync(`${clientLibPath}/css.txt`, cssTxtFormat);
      console.log('==== Created .content.xml and css.txt ====');
    });
    // Create js clientlibs template
    Object.keys(config.concat).forEach(clientlib => {
      console.log('==== Creating JS templates ====');
      let clientLibPath = `${config.demoFolder}/${clientlib}.publish`;
      fs.mkdirsSync(clientLibPath);
      // Create .content.xml and js.txt
      fs.writeFileSync(`${clientLibPath}/.content.xml`, affiliateTemplates.templates['.content.xml'].join('\n').replace('{category}', `${clientlib}.publish`));
      fs.writeFileSync(`${clientLibPath}/js.txt`, affiliateTemplates.templates['js.txt'].join('\n').replace('{filename}', clientlib));
      console.log('==== Created JS templates ====');
    });
    console.log('==== Created SCSS clientlibs configuration ====');
  }
  // Process assets
  const regionalAssetFolder = `${config.assetFolder}/styles/${config.scss.defaultRegionCode}`;
  if (!fs.existsSync(regionalAssetFolder)) {
    console.log('==== Creating regional asset SCSS folders ====');
    fs.mkdirsSync(regionalAssetFolder);
    console.log('==== Created regional asset SCSS folders ====');
    // Copy from blueprint
    if (blueprints.length) {
      console.log('==== Extracting blueprints ====');
      _copyBlueprintFiles(blueprints);
      console.log('==== Extracted blueprints ====');
    }
  }
}

function _generateConfig(data) {
  if (data && data.length) {
    data.forEach((qna) => configData[qna.key] = qna.answer);
    // Create dynamic path
    if (!configData.dynamicPath) {
      const { rootArtifactId, brand, subBrand } = configData;
      configData.dynamicPath = `${rootArtifactId}/${brand}/${subBrand}`;
    }
  }
  let configTemplateStr = JSON.stringify(configTemplate, null, 4);
  Object.keys(configData).forEach(key => {
    const reg = new RegExp(`\\$\\{${key}\\}`, 'g');
    configTemplateStr = configTemplateStr.replace(reg, configData[key]);
  });
  try {
    if (!fs.existsSync('config.json')) {
      console.log('==== Writing config.json ====');
      fs.writeFileSync('config.json', configTemplateStr);
      console.log('==== config.json created ====');
    } else {
      console.log('==== config.json exists ====');
    }
    _generateRootProject(JSON.parse(configTemplateStr));
  } catch (e) {
    console.log('Some error occurred while processing config.json');
    console.log(e);
  }
}

function _initialize() {
  console.log('==== Generating configuration ====');
  if (questions.length) {
    wizard({ questions }).then(_generateConfig);
  } else {
    _generateConfig();
  }
}

// Read path.xml
try {
  let xmlData = fs.readFileSync('./path.xml');
  xmlParser.parseString(xmlData, function (err, data) {
    if (err) {
      _addQuestions();
      _initialize();
      return;
    }
    configData.dynamicPath = data.path;
    [rootArtifactId, brand, subBrand] = data.path.split('/');
    Object.assign(configData, { rootArtifactId, brand, subBrand });
    _initialize();
  });
} catch (e) {
  _addQuestions();
  _initialize();
}
