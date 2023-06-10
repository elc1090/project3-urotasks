import path from 'path';

export default 
{
  entry: './src/index.js', // Entry point of your application
  
  output:
  {
    path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
    filename: 'bundle.js', // Output filename
  },

  module: 
  {
    rules: 
    [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'import-glob-loader',
        ],
      },
    ],
  },
};