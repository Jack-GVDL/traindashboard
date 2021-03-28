// to use remote from electron (communication between main process and renderer)
// "nodeIntegration: true" is used
// reference
// - https://stackoverflow.com/questions/62777834/how-fix-dirname-not-defined-when-using-electron-events-with-vue
module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
};
