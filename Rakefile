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

def in_root(file)
  File.expand_path("../#{file}",  __FILE__)
end

def write_js(filename, contents)
  Dir.mkdir(in_root("pkg")) unless Dir.exists?(in_root("pkg"))
  widget_path = in_root("pkg/#{filename}")
  File.open(widget_path, "w") do |f|
    f.write(contents)
  end
  puts "Created #{widget_path}"
end

def upload_js(bucket_name, filename, credentials)
  storage = Fog::Storage.new credentials
  directory = storage.directories.get(bucket_name)

  key = "widget/#{filename}"
  file = directory.files.create(
    key: key,
    body: File.read(in_root("pkg/#{filename}")),
    public: true,
    content_type: 'application/javascript'
  )
  puts "Uploaded #{CGI::unescape file.public_url}"
end

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

    source = env['uploadcare/production.js']

    write_js(
      "uploadcare-#{UploadcareWidget::VERSION}.min.js",
      YUI::JavaScriptCompressor.new.compress(source)
    )

    write_js(
      "uploadcare-latest.min.js",
      YUI::JavaScriptCompressor.new.compress(source)
    )

    write_js(
      "uploadcare-#{UploadcareWidget::VERSION}.js",
      source
    )
  end

  desc 'Upload latest version of widget'
  task upload: [:env] do
    credentials = YAML::parse_file(in_root('fog_credentials.yml')).to_ruby
    credentials.symbolize_keys!
    bucket_name = credentials.delete(:bucket_name)

    upload_js(bucket_name, "uploadcare-#{UploadcareWidget::VERSION}.min.js", credentials)
    upload_js(bucket_name, "uploadcare-#{UploadcareWidget::VERSION}.js", credentials)
    upload_js(bucket_name, "uploadcare-latest.min.js", credentials)
  end
end

desc "Build and upload last version of widget"
task js: ['js:build', 'js:upload']
