/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		domains: [
			"localhost",
			"beta.test.com",
			"testadmin.test.com",
			"test.blob.core.windows.net",
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				port: "",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "test",
				port: "",
			},
		],
	},
};

module.exports = nextConfig;
