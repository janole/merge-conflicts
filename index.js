const { execSync } = require("child_process");

const S = string => string.toString().replace(/[^0-9a-z-\/]/ig, "").replace(/^[^0-9a-z]/i, "");

const branch1 = S(process.argv[2]);
const branch2 = S(process.argv[3]);

const base = execSync("git merge-base " + branch1 + " " + branch2);

const conflict = execSync("git merge-tree " + S(base) + " " + branch1 + " " + branch2);

const lines = conflict.toString().split("\n");

for (let state = 0, changed = null, i = 0; i < lines.length; i++)
{
	const line = lines[i];

        if (line === "changed in both")
        {
		state = 1;
        }
        else
        if (state === 1)
        {
                state = 0;

                changed = line;
        }
        else
        if (line.match(/^.<<<<<+ \./))
	{
		console.log("CONFLICT " + changed);
        }
}

