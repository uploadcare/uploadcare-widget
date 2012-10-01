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

def write_file(filename, contents)
  Dir.mkdir(in_root("pkg")) unless Dir.exists?(in_root("pkg"))
  widget_path = in_root("pkg/#{filename}")
  File.open(widget_path, "wb") do |f|
    f.write(contents)
  end
  puts "Created #{widget_path}"
end

def upload_file(bucket_name, credentials, filename, key, content_type)
  storage = Fog::Storage.new credentials
  directory = storage.directories.get(bucket_name)

  file = directory.files.create(
    key: key,
    body: File.read(in_root("pkg/#{filename}")),
    public: true,
    content_type: content_type
  )
  puts "Uploaded #{CGI::unescape file.public_url}"
end

namespace :js do
  task :env do
    require 'yaml'
    ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __FILE__)
    Bundler.require :development
    require "active_resource/railtie"
  end

  task :application do
    require 'rubygems'
    ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __FILE__)
    require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])
    # require "active_record/railtie"
    require "action_controller/railtie"
    require "active_resource/railtie"
    require "sprockets/railtie"

    if defined?(Bundler)
      Bundler.require(*Rails.groups(:assets => %w(development test)))
    end
    
    class Application < Rails::Application
      config.encoding = "utf-8"
      config.assets.enabled = true
      config.assets.version = rand # no cache
      config.assets.compress = false
      config.assets.compile = true
      config.assets.digest = false
      config.assets.debug = false
      config.assets.prefix = "widget/#{UploadcareWidget::VERSION}"
      config.active_support.deprecation = :notify
      config.assets.js_compressor = :yui
      config.action_controller.asset_host = '//uploadcare-static.s3.amazonaws.com'
    end
    Application.initialize!
  end

  desc "Build last version of widget"
  task build: [:application] do

    js = Rails.application.assets['uploadcare/widget.js'].source

    write_file(
      "uploadcare-#{UploadcareWidget::VERSION}.min.js",
      YUI::JavaScriptCompressor.new.compress(js)
    )
    write_file(
      "uploadcare-latest.min.js",
      YUI::JavaScriptCompressor.new.compress(js)
    )
    write_file(
      "uploadcare-#{UploadcareWidget::VERSION}.js",
      js
    )

    css = Rails.application.assets['uploadcare/widget.css'].source
    write_file(
      "uploadcare.css",
      YUI::CssCompressor.new.compress(css)
    )

    write_file(
      "zerospace-webfont.eot",
      Rails.application.assets['inline-blocks/zerospace-webfont.eot'].source
    )
  end

  desc 'Upload latest version of widget'
  task upload: [:application] do
    credentials = YAML::parse_file(in_root('fog_credentials.yml')).to_ruby
    credentials.symbolize_keys!
    bucket_name = credentials.delete(:bucket_name)

    upload_file(bucket_name, credentials,
      "uploadcare-#{UploadcareWidget::VERSION}.min.js",
      "#{Rails.application.config.assets.prefix}/uploadcare/uploadcare-#{UploadcareWidget::VERSION}.min.js",
      'application/javascript'
    )
    upload_file(bucket_name, credentials,
      "uploadcare-#{UploadcareWidget::VERSION}.js",
      "#{Rails.application.config.assets.prefix}/uploadcare/uploadcare-#{UploadcareWidget::VERSION}.js",
      'application/javascript'
    )
    upload_file(bucket_name, credentials,
      "uploadcare-latest.min.js",
      "widget/uploadcare-latest.min.js",
      'application/javascript'
    )

    upload_file(bucket_name, credentials,
      'uploadcare.css',
      "#{Rails.application.config.assets.prefix}/uploadcare/uploadcare.css",
      'text/css'
    )
    upload_file(bucket_name, credentials,
      'zerospace-webfont.eot',
      "#{Rails.application.config.assets.prefix}/inline-blocks/zerospace-webfont.eot",
      'application/vnd.ms-fontobject'
    )
  end
end

desc "Build and upload last version of widget"
task js: ['js:build', 'js:upload']
