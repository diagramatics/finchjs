###
#=================================================
#
#  Setup
#
#=================================================

Install Ruby
Install Node.js (http://nodejs.org/)
npm install -g grunt-cli
npm install coffee-script
npm install grunt --save-dev
npm install grunt-contrib-coffee --save-dev
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-watch --save-dev
npm install grunt-contrib-jasmine --save-dev

###
module.exports = (grunt) ->
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-jasmine')
	grunt.registerTask('default', [
		'coffee:banner'
		'update_banner'
		'coffee:dist'
		'uglify:dist'
		'coffee:test'
		'watch'
	])

	grunt.registerTask 'update_banner', 'updates the banner information', ->
		try
			banner = grunt.file.read('scripts/banner.js').toString()
		catch e
			banner = ""
		#END try

		uglfiy_cfg = grunt.config('uglify')
		uglfiy_cfg.dist.options.banner = banner

		grunt.config('uglify', uglfiy_cfg)
	#END registerTask

	grunt.registerTask 'test', ['coffee:test', 'jasmine:dist']
	
	grunt.initConfig
		'pkg': grunt.file.readJSON('package.json')

		'coffee':
			'banner':
				options:
					bare: true
				#END options

				files:
					'scripts/banner.js': ["coffee/banner.coffee"]
				#END files
			#END banner

			'dist':
				options:
					join: true
				#END options

				files:
					'<%= pkg.name %>.js': [
						"coffee/banner.coffee"
						"coffeeV2/finch.coffee"
						"coffeeV2/finch.node.coffee"
						"coffeeV2/finch.route.coffee"
						"coffeeV2/finch.log.coffee"
					]
				#END files
			#END coffee:dist

			'test':
				files:
					"tests/jasmine2.0.0-sinon.js": "tests/jasmine2.0.0-sinon.coffee"
					"tests/tests.js": "tests/tests.coffee"
					"tests/tests2.js": "tests/tests2.coffee"
				#END files
			#END coffee:test
		#END coffee

		'uglify':
			'dist':
				options:
					'banner': '' #Updated lated in the update_banner task
				#END options
				files:
					'<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
				#END files
			#END uglifY:dist
		#END uglify

		'jasmine':
			'dist':
				src: 'finch.min.js'
				options:
					vendor: [
						'tests/sinon-1.7.3.js'
						'tests/jasmine2.0.0-sinon.js'
					]
					specs: 'tests/tests2.js'
				#END options
			#END jasmine:dist
		#END jasmine

		'watch':
			'banner_coffee':
				'files': ["coffee/banner.coffee"]
				'tasks': ['coffee:banner', 'update_banner', 'coffee:dist', 'uglify:dist']
			#END watch:banner_coffee

			'dist_coffee':
				'files': ["coffee/<%= pkg.name %>2.coffee"]
				'tasks': ['coffee:dist', 'uglify:dist']
			#END watch:dist_coffee

			'test_coffee':
				'files': ['tests/*.coffee']
				'tasks': ['coffee:test']
			#END watch:test_coffee
		#END watch
	#END initConfig
#END exports
