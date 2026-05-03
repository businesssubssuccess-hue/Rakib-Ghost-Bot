{ pkgs }: {
	deps = [
   pkgs.vips
   pkgs.ffmpeg
   pkgs.python3
   pkgs.pkg-config
   pkgs.pixman
   pkgs.librsvg
   pkgs.giflib
   pkgs.libjpeg
   pkgs.libpng
   pkgs.pango
   pkgs.cairo
	 pkgs.unzip
		pkgs.libuuid
	];
	env = {
		LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];
	};
}