import { types as t } from './babelArgumentProvider';
import path from 'path';

function isRelativeImport(importPath) {
  // https://nodejs.org/api/modules.html#modules_all_together
  return importPath.startsWith('./') ||
         importPath.startsWith('/') ||
         importPath.startsWith('../');
}

function isNodeModuleImport(importPath) {
  return importPath.indexOf('/') === -1 ||
         !isRelativeImport(importPath);
}

function getImportPath(file, relativeImportPath) {
  var filename = file.opts.filename;
  var filePath = filename.replace(/[^\/]+$/, '');
  var result = path.join(filePath, relativeImportPath);
  return result;
}

export function getImportModuleName(file, importPath) {
  // check if it is a relative path or a module name
  var importedModulePath = isNodeModuleImport(importPath) ?
    importPath :
    getImportPath(file, importPath);

  // Use the getModuleName()
  // so that the getModuleId configuration option is called
  // There should be a better way than cloning
  var importedModuleFile = t.clone(file);
  importedModuleFile.opts = t.cloneDeep(file.opts);
  importedModuleFile.opts.filename = importedModuleFile.opts.filenameRelative = importedModulePath + '.js';

  // importedModuleFile.opts.moduleIds = true;
  var result = importedModuleFile.opts.moduleIds ?
    importedModuleFile.getModuleName() :
    importPath;
  return result;
}
