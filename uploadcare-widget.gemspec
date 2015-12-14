$:.push File.expand_path("../lib", __FILE__)

require 'rake'

# Maintain your gem's version:
require "uploadcare-widget/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "uploadcare-widget"
  s.version     = UploadcareWidget::VERSION
  s.authors     = ["Vadik Rastyagaev"]
  s.email       = ["vr@whitescape.com"]
  s.homepage    = "http://uploadcare.com"
  s.summary     = "Widget for uploadcare service"
  s.description = "Widget for uploadcare service."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.markdown"]

  s.test_files = FileList["test/**/*"].exclude('test/dummy/vendor/bundle/**/*').exclude('test/dummy/tmp/**/*')

  s.add_dependency "sass-rails"
  s.add_dependency "coffee-rails"
  s.add_dependency "ejs"
  s.add_dependency "spans", '0.0.7'
  s.add_dependency "yui-compressor", '0.12.0'
end
