/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic'
		},
		inline: {
			name: 'inline',
			creator: 'inline'
		}
	};

	var tests = {
		// #2420
		'test scroll position doesn\'t change when preventScroll is set to true': assertScrollOnFocus(),

		// This test is to detect whenever browser implements preventScroll flag, so we can update CKEDITOR.editable.focus method (#2420).
		'test native preventScroll': assertScrollOnFocus( true )
	};

	tests = bender.tools.assertScrollOnFocussForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );

	function assertScrollOnFocus( useNative ) {
		return function( editor ) {
			// Edge should be ignored until this is fixed:
			// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/14721015/
			if ( CKEDITOR.env.edge && !useNative ) {
				assert.ignore();
			}
			var isFallbackNeeded = !CKEDITOR.env.chrome || CKEDITOR.env.safari,
				editable = editor.editable(),
				body = CKEDITOR.document.getBody(),
				html = body.getParent(),
				spacer = new CKEDITOR.dom.element( 'div' ),
				scrollTop = {};

			spacer.setStyle( 'height', '100vh' );
			spacer.insertBefore( body.getFirst() );

			scrollTop.body = body.$.scrollTop;
			scrollTop.html = html.$.scrollTop;

			if ( useNative ) {
				editable.$.focus( { preventScroll: true } );
				if ( isFallbackNeeded ) {
					CKEDITOR.window().on( 'scroll', function() {
						resume( function() {
							assert.isTrue( true, 'Window should be scrolled' );
						} );
					} );
					wait();
				}
			} else {
				editable.focus( { preventScroll: true } );
			}

			if ( !isFallbackNeeded ) {
				assert.areEqual( scrollTop.body, body.$.scrollTop, 'Body should be scrolled top' );
				assert.areEqual( scrollTop.html, html.$.scrollTop, 'Html should be scrolled top' );
			}
		};
	}
} )();
