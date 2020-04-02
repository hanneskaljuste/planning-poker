module.exports = {
  name: 'planning-poker',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/planning-poker',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
