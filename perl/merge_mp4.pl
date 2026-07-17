use strict;
use warnings;
use File::Spec;
use Encode qw(decode encode);

# Configure the terminal output encoding so error text displays correctly
binmode(STDOUT, ":encoding(cp936)");
binmode(STDERR, ":encoding(cp936)");

# 1. Base path configuration
my $target_dir  = 'D:/yt/yt-dlp_win/pre7';
my $txt_file    = 'filelist.txt';
my $output_name = 'output.mp4';

my $full_txt_path    = File::Spec->catfile($target_dir, $txt_file);
my $full_output_path = File::Spec->catfile($target_dir, $output_name);

my @mp4_files;

# 2. Read file directory matching Windows CP936 structure
opendir(my $dh, $target_dir) or die "Cannot open directory: $!";
while (my $raw_name = readdir($dh)) {
    next if $raw_name =~ /^\.{1,2}$/;
    next unless $raw_name =~ /\.mp4$/i;
    next if $raw_name eq $output_name; 
    
    # Internal Perl representation
    my $clean_name = decode('cp936', $raw_name);
    push @mp4_files, $clean_name;
}
closedir($dh);

# 3. Write filelist.txt as a clean UTF-8 text file WITHOUT a BOM
open(my $fh, ">:encoding(UTF-8)", $full_txt_path) or die "Cannot create file list: $!";

foreach my $file (@mp4_files) {
    my $full_video_path = File::Spec->catfile($target_dir, $file);
    
    # FFmpeg requirements
    $full_video_path =~ s/\\/\//g;
    $full_video_path =~ s/'/'\\''/g; 
    
    # Write text cleanly into the UTF-8 filehandle
    print $fh "file '$full_video_path'\n";
}
close($fh);

print "-> Generated filelist.txt safely (Clean UTF-8 without BOM).\n";

# 4. Final Shell Execution Fix
# Convert script paths to raw CP936 bytes to accommodate Windows cmd routing
my $os_txt_path    = encode('cp936', $full_txt_path);
my $os_output_path = encode('cp936', $full_output_path);

# Explicitly invoke cmd.exe to manage strings, eradicating the 'Can't spawn / I/O control' bug
my $ffmpeg_cmd = "cmd.exe /c ffmpeg -f concat -safe 0 -i \"$os_txt_path\" -c copy \"$os_output_path\"";

print "-> Executing FFmpeg process...\n";
my $exit_code = system($ffmpeg_cmd);

if ($exit_code == 0) {
    print "\n[Success] Videos merged seamlessly!\nSaved destination: $full_output_path\n";
    # unlink($full_txt_path); 
} else {
    my $real_error = $? >> 8;
    print "\n[Error] FFmpeg operation aborted with return status: $real_error\n";
    print "Verification steps:\n";
    print "1. Confirm the resolution and frame rate of all videos match exactly.\n";
    print "2. Inspect the file content manually if structural file errors persist.\n";
}
