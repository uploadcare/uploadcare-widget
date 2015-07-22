require "uploadcare-widget/version"
require "uploadcare-widget/engine"

module UploadcareWidget
end

require "sprockets"
module Sprockets

  class MyJstProcessor < JstProcessor

    def evaluate(scope, locals, &block)
      name = scope.logical_path.split('/').slice(2..-1).join('/')
      "uploadcare.templates.JST[#{name.inspect}] = #{indent(data)};"
    end
  end

  Sprockets.register_engine '.jst', MyJstProcessor
end
