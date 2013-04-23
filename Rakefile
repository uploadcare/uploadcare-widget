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
  dir = in_root(File.join('pkg', File.dirname(filename)))
  FileUtils.mkdir_p(dir) unless Dir.exists?(dir)
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

def setup_prefix(version)
  Rails.application.config.assets.prefix = "widget/#{version}"
end

def header_comment(version)
  <<-eos
/*
 * Uploadcare (#{version})
 * Date: #{Time.now}
 * Rev: #{`git rev-parse --verify HEAD`[0..9]}
 */
  eos
end

def wrap_namespace(js)
  ";(function(uploadcare){#{js}}({}));"
end

def build_widget(version)
  comment = header_comment(version)
  js = Rails.application.assets['uploadcare/widget.js'].source
  js = wrap_namespace(js)

  write_file(
    "#{version}/uploadcare-#{version}.min.js",
    comment + YUI::JavaScriptCompressor.new.compress(js)
  )
  write_file(
    "#{version}/uploadcare-#{version}.js",
    comment + js
  )
end

def upload_widget(version)
  credentials = {
    fog: {
      provider: 'AWS',
      aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
    },
    bucket_name: ENV['AWS_BUCKET_NAME']
  }

  upload_file(credentials[:bucket_name], credentials[:fog],
    "#{version}/uploadcare-#{version}.min.js",
    "#{Rails.application.config.assets.prefix}/uploadcare/uploadcare-#{version}.min.js",
    'application/javascript'
  )
  upload_file(credentials[:bucket_name], credentials[:fog],
    "#{version}/uploadcare-#{version}.js",
    "#{Rails.application.config.assets.prefix}/uploadcare/uploadcare-#{version}.js",
    'application/javascript'
  )
end

namespace :js do
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

      config.active_support.deprecation = :notify
      config.assets.js_compressor = :yui
      config.action_controller.asset_host = 'https://ucarecdn.com'
    end
    Application.initialize!
  end

  namespace :latest do
    task build: [:application] do
      setup_prefix('latest')
      build_widget('latest')
    end

    task upload: [:application] do
      setup_prefix('latest')
      upload_widget('latest')
    end
  end

  namespace :release do
    task build: [:application] do
      setup_prefix(UploadcareWidget::VERSION)
      build_widget(UploadcareWidget::VERSION)
    end

    task upload: [:application] do
      setup_prefix(UploadcareWidget::VERSION)
      upload_widget(UploadcareWidget::VERSION)
    end
  end

  namespace :prefixed do
    task :build, [:prefix] => [:application] do | t, args |
      setup_prefix("latest-" + args[:prefix])
      build_widget("latest-" + args[:prefix])
    end

    task :upload, [:prefix] => [:application] do | t, args |
      setup_prefix("latest-" + args[:prefix])
      upload_widget("latest-" + args[:prefix])
    end
  end

  task latest: ["latest:build", "latest:upload"]
  task release: ["release:build", "release:upload"]
end
