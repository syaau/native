require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name      = "RNApp"
  s.version   = package["version"]
  s.summary   = package["description"]
  s.author    = 'syaau'
  s.homepage  = package["homepage"]
  s.license   = package["license"]
  s.platform  = :ios, "8.0"
  s.source    = { :git => "https://github.com/bhoos/native" }
  s.source_files = "ios/*.{h,m}"
  s.dependency "React"
end
