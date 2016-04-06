require "bundler"
Bundler.setup

require "middleman"
require "yaml"
require "active_support/core_ext"

Dir["./lib/*"].each { |f| require f }
