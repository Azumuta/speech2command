<!DOCTYPE html>
<html>
	<head>
		<title>Azumuta speech recognition tool.</title>

		<link rel="stylesheet" type="text/css" href="normalize.css">
		<style type="text/css">
			html, body {
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
				display: table
			}
			body { font-family: sans-serif; }
			table { border-collapse: collapse; }
			table, td { border: 2px solid black; }
			td {
				width: 20%;
				text-align: center;
				font-size: 2vw;
			}
			#azumuta { text-decoration: line-through; }
			vosk-recognizer {
				/*display: none;*/
				--font-size: 2vw;
			}
			#text {
				display: none;
			}
		</style>

		<script type="text/javascript">
			var allWords = [];
			var globalRecognizer;
			<?php
				$words = [];
				$handle = fopen("../words.txt", "r");
				while (($line = fgets($handle)) !== false) {
					array_push($words, trim($line, "\n."));
					echo "allWords.push('" . trim(strtolower($line), "\n.") . "');";
				}
			?>

		</script>

		<script type="text/javascript" src="jquery.js"></script>
		<script type="text/javascript" src="marking.js"></script>
		<script type="text/javascript">
			const resultHandler = markWord;
			const resetHandler = resetColors;
		</script>
		<script type="text/javascript" src="../script/resultHandling.js"></script>
	</head>
	<body style='width: 100%; height: 100%'>
		<table style='width: 100%; height: 100%'>
			<?php
				$wi = 0;
				for ($i=0; $i < 6; $i++) { 
					echo "<tr>";
					for ($l=0; $l < 5; $l++) { 
						if ($wi < count($words)) {
							if ($words[$wi] == '<UNK>') {
								echo "<td id='UNK'>";
								echo "UNKNOWN";
							} else if ($words[$wi] == '<UND>') {
								echo "<td id='UND'>";
								echo "UNDEFINED";
							} else {
								echo "<td id='" . strtolower($words[$wi]) . "'>";
								echo htmlentities($words[$wi], ENT_COMPAT);
							}
							echo "</td>";
							$wi += 1;
						}
					}


					if ($i == 5) {
						echo '<td colspan="2">';
						// echo '<vosk-recognizer model-url="model-nl.tar.gz" oneshot></vosk-recognizer>';
						echo '<script src="../script/VoskJS.js"></script>';
						echo '</td>';
					}


					echo "</tr>";
				}
			?>
		</table>


		<script type="text/javascript">
			thisRec = new VoskJS.Recognizer("model-nl.tar.gz")
			thisRec.onresult = result => {
				if (result.result) {
					handleResult(result, markWord, resetColors)
				}
			}
			thisRec.getActive().then(active => thisRec.setActive(!active));
		</script>


	</body>
</html>
