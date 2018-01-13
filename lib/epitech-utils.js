'use babel';

import { CompositeDisposable } from 'atom';

const EpitechConfig = {
	subscriptions: null,

	activate(state) {
		this.subscriptions = new CompositeDisposable();
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'epitech-utils:insert-header': () => this.insertHeader(),
			'epitech-utils:insert-guards': () => this.insertGuards()
		}));
		extension = {
			"c": "c",
			"h": "c",
			"cpp": "cpp",
			"hpp": "cpp",
			"Makefile": "Makefile",
			"sh": "Shell",
		};
		comment = {
			start: { "c": "/*", "cpp": "//", "Makefile": "##", "Shell": "##" },
			continue: { "c": "**", "cpp": "//", "Makefile": "##", "Shell": "##" },
			end: { "c": "*/", "cpp": "//", "Makefile": "##", "Shell": "##" }
		};
		template_original =
		"$CS\n" +
		"$CC EPITECH PROJECT, $YEAR\n" +
		"$CC $PROJECT\n" +
		"$CC File description:\n" +
		"$CC $DESCRIPTION\n" +
		"$CE\n" +
		"\n";
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	serialize() {
	},

	getFile() {
		file = {};
		editor = atom.workspace.getActiveTextEditor();
		file.path = editor.getPath();
		file.name = file.path.split('/').pop();
		file.ext = file.name.substr(file.name.lastIndexOf('.') + 1);
		file.cs = comment.start[extension[file.ext]] || "##";
		file.cc = comment.continue[extension[file.ext]] || "##";
		file.ce = comment.end[extension[file.ext]] || "##";
	},

	getProject(filepath) {
		project = atom.project.relativizePath(filepath);
		if (!project[0]) {
			return 'No Project';
		}
		return project[0].split('/').pop();
	},

	insertHeader() {
		this.getFile();
		year = (new Date()).toDateString().split(' ').pop();
		project = this.getProject(file.path);
		description = file.name;
		template = template_original;
		template = template.split('$CS').join(file.cs);
		template = template.split('$CC').join(file.cc);
		template = template.split('$CE').join(file.ce);
		template = template.replace("$YEAR", year);
		template = template.replace("$PROJECT", project);
		template = template.replace("$DESCRIPTION", description);
		if (!editor.getText() || !editor.getText().includes(template)) {
			cursor = editor.getLastCursor();
			position = cursor.getBufferPosition();
			position.row += ((template.match(new RegExp("\n", "g")) || []).length);
			editor.moveToTop();
			editor.moveToBeginningOfLine();
			editor.insertText(template);
			cursor.setBufferPosition(position);
		}
		return;
	},

	insertGuards() {
		this.getFile();
		if (file.ext == "h" || file.ext == "hpp") {
			title = file.name.toUpperCase().replace(/[\.\-\ ]/g, '_') + "_";
			if (!editor.getText() || !editor.getText().includes(title)) {
				cursor = editor.getLastCursor();
				position = cursor.getBufferPosition();
				position.row += 3;
				editor.insertText("#ifndef " + title + "\n");
				editor.insertText("# define " + title + "\n");
				if (file.ext == "hpp") {
					editor.insertText("\n\n\n#endif " + file.cs + " " + title + "\n");
				} else {
					editor.insertText("\n\n\n#endif " + file.cs + " " + title + " " + file.ce + "\n");
				}
				cursor.setBufferPosition(position);
			}
		}
		return;
	}
};

export default EpitechConfig;
