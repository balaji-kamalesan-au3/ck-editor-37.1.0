/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink.js';
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder.js';
import CKFinderUploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter.js';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments.js';
import RealTimeCollaborativeEditing from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativeediting.js';
import RealTimeCollaborativeRevisionHistory from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativerevisionhistory.js';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import Comments from '@ckeditor/ckeditor5-comments/src/comments.js';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges.js';
import RevisionHistory from '@ckeditor/ckeditor5-revision-history/src/revisionhistory.js';
import EditorWatchdog from '@ckeditor/ckeditor5-watchdog/src/editorwatchdog.js';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import EditorSchema from './Custom Plugins/EditorSchema';
import NewWordCount from './Custom Plugins/WordCount';
import ImageCaptionMandate from './Custom Plugins/ImageCaptionMandate';
import ChangeHandler from './Custom Plugins/ChangeHandler';
// import CommentEventsHandler from './Custom Plugins/CommentEvents';

class Timestamp extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'timestamp', () => {
			// The button will be an instance of ButtonView.
			const button = new ButtonView();

			button.set( {
				label: 'Timestamp',
				withText: true
			} );

			//Execute a callback function when the button is clicked
			button.on( 'execute', () => {
				const now = new Date();

				//Change the model using the model writer
				editor.model.change( writer => {

					//Insert the text at the user's current position
					editor.model.insertContent( writer.createText( now.toString() ) );
				} );
			} );

			return button;
		} );
	}
}


class Editor extends BalloonEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
	AutoImage,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	CKFinder,
	CKFinderUploadAdapter,
	CloudServices,
	Essentials,
	Image,
	ImageCaption,
	ImageInsert,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	Paragraph,
	RealTimeCollaborativeComments,
	RealTimeCollaborativeEditing,
	RealTimeCollaborativeRevisionHistory,
	RealTimeCollaborativeTrackChanges,
	Underline,
	Comments,
	TrackChanges,
	RevisionHistory,
	EditorSchema,
	NewWordCount,
	ImageCaptionMandate,
	ChangeHandler,
	// CommentEventsHandler,
	// Timestamp
];

// Editor configuration.
Editor.defaultConfig = {
	toolbar: {
		items: [
			'bold',
			'italic',
			'link',
			'underline',
			'|',
			'blockQuote',
			'|',
			'CKFinder',
			'imageInsert',
			'|',
			'undo',
			'redo',
			'|',
			'comment',
			'trackChanges',
			'revisionHistory',
			'commentsArchive'
			// 'timestamp'
		]
	},
	language: 'en',
	image: {
		toolbar: [
			'imageTextAlternative',
			'toggleImageCaption',
			'CKFinder'
		]
	},
	comments: {
		editorConfig: {
			extraPlugins: [
				Bold,
				Italic
			]
		}
	},
	coverImage : "https://cdn.thisday.app/icons/upload.jpg",
	callSaveDraft : function(){
		return false;
	}
};

export default { Editor, EditorWatchdog };
