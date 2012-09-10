#!/usr/bin/env rake
begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end
begin
  require 'rdoc/task'
rescue LoadError
  require 'rdoc/rdoc'
  require 'rake/rdoctask'
  RDoc::Task = Rake::RDocTask
end

RDoc::Task.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'UploadcareWidget'
  rdoc.options << '--line-numbers'
  rdoc.rdoc_files.include('README.rdoc')
  rdoc.rdoc_files.include('lib/**/*.rb')
end




Bundler::GemHelper.install_tasks

require 'rake/testtask'

Rake::TestTask.new(:test) do |t|
  t.libs << 'lib'
  t.libs << 'test'
  t.pattern = 'test/**/*_test.rb'
  t.verbose = false
end


task :default => :test

namespace :js do
  task :env do
    require 'yaml'
    ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __FILE__)
    Bundler.require :development
  end

  desc "Build last version of widget"
  task build: [:env] do
    env = Sprockets::Environment.new
    env.append_path File.expand_path('../app/assets/stylesheets', __FILE__)
    env.append_path File.expand_path('../app/assets/javascripts', __FILE__)
    env.append_path File.expand_path('../app/assets/image', __FILE__)

    source = env['uploadcare/widget.js']
    source = YUI::JavaScriptCompressor.new.compress(source)

    filename = "uploadcare-#{UploadcareWidget::VERSION}.min.js"
    widget_path = File.expand_path("../pkg/#{filename}",  __FILE__)
    File.open(widget_path, "w") do |f|
      f.write(source)
    end
    puts "Created #{widget_path}"
  end

  desc 'Upload last version of widget'
  task upload: [:env] do
    credentials = YAML::parse_file(File.expand_path("../fog_credentials.yml",  __FILE__)).to_ruby
    credentials.symbolize_keys!
    bucket_name = credentials.delete(:bucket_name)
    storage = Fog::Storage.new credentials
    directory = storage.directories.get(bucket_name)

    filename = "uploadcare-#{UploadcareWidget::VERSION}.min.js"
    widget_path = File.expand_path("../pkg/#{filename}",  __FILE__)    
    key = "widget/#{filename}"
    file = directory.files.create(key: key, body: File.read(widget_path), public: true)

    puts "Created #{CGI::unescape file.public_url}"
  end
end

desc "Build and upload last version of widget"
task js: ['js:build', 'js:upload']
