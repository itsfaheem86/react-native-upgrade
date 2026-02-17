const Config = {
  graphqlHttpServerUri:
    'https://codersauthoritydevelopment.du.r.appspot.com/graphql',
  graphqlWsServerUri:
    'wss://codersauthoritydevelopment.du.r.appspot.com/graphql',
  awsS3BucketCloudFrontUri: 'https://d67l7stus8v2o.cloudfront.net/',
};

if (__DEV__) {
  Config.graphqlHttpServerUri = 'http://192.168.1.100:3000/graphql';
  Config.graphqlWsServerUri = 'ws://192.168.1.100:3000/graphql';
}

export default Config;
