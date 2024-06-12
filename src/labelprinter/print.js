const { exec } = require("child_process");

const printLabel = (productId, price) => {
	const virtualEnvActivateScript =
		"source /Users/mathiaslorenceau/Code/label_printer/myenv/bin/activate";
	const pythonScript = `python /Users/mathiaslorenceau/Code/label_printer/main.py ${productId} ${price}`;

	exec(`${virtualEnvActivateScript} && ${pythonScript}`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`stderr: ${stderr}`);
		}
		if (stdout) {
			console.log(`Output: ${stdout}`);
		}
	});
};

module.exports = printLabel;
