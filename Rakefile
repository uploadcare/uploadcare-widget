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

def file_list(path)
  path = in_root path
  Dir.glob(File.join(path, "*"))
    .select { |f| File.file?(f) }
    .map { |f| [f, File.basename(f), File.basename(f, '.*'), File.extname(f)] }
end

WIDGET_PLUGINS = file_list('app/assets/javascripts/uploadcare/plugins')
  .map { |_, _, without_ext| without_ext }
IMAGES_TYPES = {
  '.png' => 'image/png',
  '.gif' => 'image/gif',
  '.jpg' => 'image/jpeg',
  '.jpeg' => 'image/jpeg'
}
IMAGES = file_list('app/assets/images/uploadcare')
  .map { |full, base, without_ext, ext| [full, base, IMAGES_TYPES[ext]] }

def ensure_dir(filename)
  path = File.dirname filename
  FileUtils.mkdir_p(path) unless Dir.exists?(path)
end

def write_file(filename, contents)
  widget_path = in_root("pkg/#{filename}")
  ensure_dir widget_path
  File.open(widget_path, "wb") do |f|
    f.write(contents)
  end
  puts "Created #{widget_path}"
end

def cp_file(src, dest)
  widget_path = in_root("pkg/#{dest}")
  ensure_dir widget_path
  FileUtils.copy_file src, widget_path
  puts "Copied #{widget_path}"
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

def plugin_comment(version, name)
  <<-eos
/*
 * Uploadcare plugin "#{name}"
 * Wigget version: #{version}
 * Date: #{Time.now}
 * Rev: #{`git rev-parse --verify HEAD`[0..9]}
 */
  eos
end

def wrap_namespace(js, version)
  ";(function(uploadcare, SCRIPT_BASE){#{js}}({}, '//ucarecdn.com/widget/#{version}/uploadcare/'));"
end

def wrap_plugin(js)
  ";uploadcare.plugin(function(uploadcare){#{js}});"
end

def build_widget(version)
  comment = header_comment(version)
  js = Rails.application.assets['uploadcare/widget.js'].source
  js = wrap_namespace(js, version)

  write_file(
    "#{version}/uploadcare-#{version}.min.js",
    comment + YUI::JavaScriptCompressor.new.compress(js)
  )
  write_file(
    "#{version}/uploadcare-#{version}.js",
    comment + js
  )

  WIDGET_PLUGINS.each do |name|
    js = Rails.application.assets["uploadcare/plugins/#{name}"].source
    js = wrap_plugin(js)
    comment = plugin_comment(version, name)
    write_file(
      "#{version}/plugins/#{name}.min.js",
      comment + YUI::JavaScriptCompressor.new.compress(js)
    )
    write_file(
      "#{version}/plugins/#{name}.js",
      comment + js
    )
  end

  IMAGES.each do |full, base|
    cp_file full, "#{version}/#{base}"
  end
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

  upload = lambda do |name, type|
    upload_file(credentials[:bucket_name], credentials[:fog],
      "#{version}/#{name}",
      "#{Rails.application.config.assets.prefix}/uploadcare/#{name}",
      type
    )
  end

  upload_js = lambda do |name|
    upload.call name, 'application/javascript'
  end

  upload_js.call "uploadcare-#{version}.min.js"
  upload_js.call "uploadcare-#{version}.js"

  WIDGET_PLUGINS.each do |name|
    upload_js.call "plugins/#{name}.min.js"
    upload_js.call "plugins/#{name}.js"
  end

  IMAGES.each do |full, base, type|
    upload.call base, type
  end
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
