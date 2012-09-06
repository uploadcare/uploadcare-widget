$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "uploadcare-widget/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "uploadcare-widget"
  s.version     = UploadcareWidget::VERSION
  s.authors     = ["Vadik Rastyagaev"]
  s.email       = ["vr@whitescape.com"]
  s.homepage    = "http://uploacare.ru"
  s.summary     = "Widget for uploadcare service"
  s.description = "Widget for uploadcare service."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.markdown"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2"
  s.add_dependency "jquery-rails"
  s.add_dependency "sass-rails"
  s.add_dependency "coffee-rails"
  
  s.add_dependency "ejs"
end
