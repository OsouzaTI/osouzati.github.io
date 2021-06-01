function play(buffer, sound) {
	sound.setBuffer( buffer );
	sound.setLoop(false);
	sound.setVolume( 0.5 );
	sound.play();
}