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


task :make_js_build do
  ENV['RAILS_ENV'] = 'production'
  require File.expand_path("../test/dummy/config/environment.rb",  __FILE__)
  Rails.application.config.assets.js_compressor = :yui
  pkg_dir = File.expand_path("../pkg",  __FILE__)
  Dir.mkdir(pkg_dir) unless Dir.exists?(pkg_dir)
  widget_path = File.expand_path("../pkg/uploadcare-#{UploadcareWidget::VERSION}.min.js",  __FILE__)
  File.open(widget_path, 'w') do |f|
    f.write Rails.application.assets['uploadcare/widget.js']
  end
  puts "Created #{widget_path}"

  storage = Fog::Storage.new(
    provider: :aws,
    aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
  )
  directory = storage.directories.get(ENV['AWS_BUCKET_NAME'])
  key = "widget/uploadcare-#{UploadcareWidget::VERSION}.min.js"
  file = directory.files.create(key: key, body: File.read(widget_path), public: true)
  puts "Creates #{file.public_url}"
end
