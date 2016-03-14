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
  path = in_root(path)
  Dir.glob(File.join(path, "*"))
    .select { |f| File.file?(f) }
    .map { |f| [f, File.basename(f), File.basename(f, '.*'), File.extname(f)] }
end

PACKAGES = ['uploadcare', 'uploadcare.full', 'uploadcare.ie8', 'uploadcare.api']

IMAGES_TYPES = {
  '.png' => 'image/png',
  '.gif' => 'image/gif',
  '.jpg' => 'image/jpeg',
  '.jpeg' => 'image/jpeg'
}
IMAGES = file_list('app/assets/images/uploadcare/images')
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

def build_widget(version)
  header = <<-eos
/*
 * Uploadcare (#{version})
 * Date: #{Time.now}
 * Rev: #{`git rev-parse --verify HEAD`[0..9]}
 */
  eos

  def wrap_namespace(js, version)
    ";(function(uploadcare, SCRIPT_BASE){\n#{js}}({}, '//ucarecdn.com/widget/#{version}/uploadcare/'));"
  end

  uglifier = Uglifier.new({
    :output => {
      :ascii_only => false,
    },
    :mangle => {
      :eval => true,
      :except => [
        # in template engine
        '__p',
      ],
    },
    # From jQuery config:
    # https://github.com/jquery/jquery/blob/c7431c7793f7605250807f91bee7c9ddcbaeb91b/Gruntfile.js#L184
    :compress => {
      :hoist_funs => false,
      :loops => false,
      :unused => false,
    },
  })

  PACKAGES.each do |package|
    js = Rails.application.assets["uploadcare/build/#{package}.coffee"].source
    js = wrap_namespace(js, version)
    write_file("#{version}/#{package}.js", header + js)
    minified = uglifier.compile(js)
    write_file("#{version}/#{package}.min.js", header + minified)
  end

  IMAGES.each do |full, base|
    cp_file full, "#{version}/images/#{base}"
  end
end

def upload_widget(version)
  storage = Fog::Storage.new({
    provider: 'AWS',
    aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  })
  directory = storage.directories.get(ENV['AWS_BUCKET_NAME'])

  upload = lambda do |name, type, force_version=false|
    key = "widget/#{force_version or version}/uploadcare/#{name}"
    file = directory.files.create(
      body: File.read(in_root("pkg/#{version}/#{name}")),
      key: key,
      public: true,
      content_type: type
    )
    puts "Uploaded https://#{ENV['AWS_BUCKET_NAME']}.s3.amazonaws.com/#{key}"
  end

  upload_js = lambda do |force_version=false|
    PACKAGES.each do |package|
      upload.call("#{package}.js", 'application/javascript; charset=utf-8', force_version)
      upload.call("#{package}.min.js", 'application/javascript; charset=utf-8', force_version)
    end
  end

  upload_js.call()
  if version =~ /^\d+\.\d+\.\d+$/
    upload_js.call(version[/^\d+\.\d+/] + '.x')
    upload_js.call(version[/^\d+/] + '.x')
  end

  IMAGES.each do |full, base, type|
    upload.call "images/#{base}", type
  end
end

def upload_bower(version)
  submodule = "cd submodules/uploadcare-bower &&"

  # Check if such verion already exists
  print `#{submodule} git reset --hard && git checkout master && git clean -fdx && git pull`
  tag = `#{submodule} git tag -l #{version}`.strip
  if not tag.empty?
      print "ERROR: The version already exists: <#{tag}>\n"
      return
  end

  cp = lambda do |name|
    FileUtils.cp "pkg/#{version}/#{name}", "submodules/uploadcare-bower/#{name}"
    `#{submodule} git add "#{name}"`
  end

  # Copy files from release
  PACKAGES.each do |package|
    cp.call("#{package}.js")
    cp.call("#{package}.min.js")
  end

  IMAGES.each do |full, base, type|
    cp.call "images/#{base}"
  end

  # Update version number in boser.json
  `#{submodule} sed -i -e 's/^  "version": "[^"]*"/  "version": "#{version}"/g' bower.json`
  `#{submodule} git add bower.json`

  # Commit, create a tag, and push
  `#{submodule} git commit -m"New widget release: #{version}"`
  `#{submodule} git tag #{version}`
  `#{submodule} git push origin master && git push --tags`
end

def upload_npm(version)

  cp = lambda do |name|
    FileUtils.cp "#{name}", "pkg/#{version}/#{name}" 
  end
  
  # Copy package.json and 
  cp.call "package.json"
  cp.call "README.markdown"

  # Update version number in package.json
  `cd pkg/#{version} && npm version #{version}`
  `cd pkg/#{version} && npm publish`

end

namespace :js do
  task :application do
    require 'rubygems'
    ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __FILE__)
    require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])
    require "action_controller/railtie"
    require "sprockets/railtie"

    if defined?(Bundler)
      Bundler.require(*Rails.groups(:assets => %w(development test)))
    end

    class Application < Rails::Application
      config.encoding = "utf-8"
      config.eager_load = false
      config.assets.enabled = true
      config.assets.compress = false
      config.assets.compile = true
      config.assets.digest = false
      config.assets.debug = false
      config.assets.cache_store = :memory_store

      config.active_support.deprecation = :notify
      config.action_controller.asset_host = 'https://ucarecdn.com'
    end

    Application.initialize!
  end

  namespace :latest do
    task build: [:application] do
      build_widget('latest')
    end

    task upload: [:application] do
      upload_widget('latest')
    end
  end

  namespace :release do
    task build: [:application] do
      build_widget(UploadcareWidget::VERSION)
    end

    task upload: [:application] do
      upload_widget(UploadcareWidget::VERSION)
    end

    task bower: [:application] do
      upload_bower(UploadcareWidget::VERSION)
    end
    
    task npm: [:application] do
      upload_npm(UploadcareWidget::VERSION)
    end
  end

  namespace :prefixed do
    task :build, [:prefix] => [:application] do | t, args |
      build_widget("latest-" + args[:prefix])
    end

    task :upload, [:prefix] => [:application] do | t, args |
      upload_widget("latest-" + args[:prefix])
    end
  end

  task latest: ["latest:build", "latest:upload"]
  task release: ["release:build", "release:upload"]
end
