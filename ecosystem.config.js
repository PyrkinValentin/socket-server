module.exports = {
	apps: [
		{
			name: "socket-server",
			script: "./dist/index.js",
			instances: "max",
			exec_mode: "cluster",
			watch: false,
			max_memory_restart: "1G",
			autorestart: true,
			exp_backoff_restart_delay: 100,
			time: true,
			merge_logs: true,
			error_file: "./logs/err.log",
			out_file: "./logs/out.log",
			env: {
				NODE_ENV: "production",
			},
		},
	],
}