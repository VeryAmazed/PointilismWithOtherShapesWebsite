#include <vector>
#include <sstream>
#include <fstream>
#include <cctype>
#include <cmath>
#include <string>
#include <iostream>
#include <cstdlib>

using namespace std;
typedef long long ll;
typedef long double ld;
#define INF 2001001001
#define MOD 1000000007
#define max3(a, b, c) max(a, max(b, c))
#define pb push_back 
#define f first
#define s second
#define mp make_pair
#define pll pair<ll, ll>
#define pii pair<int, int>
#define tp make_tuple

struct pixel{
	unsigned char r, g, b;
};

// global variables ok here because everything is done in this file (it's a small program)
int height;
int width;
int max_val;
ll user_rad_range;
string user_id;
vector<pixel> vec;
string fileName;
string operation;

int readFile();
int writeFile();
void modify();
void circle(int row, int col, int r);
void rectangle(int row, int col, int r);
void triangle(int row, int col, int r);
void hexagon(int row, int col, int r);

int main ( int argc, char *argv[] ){
	cout << "hello stdout" << endl;
	fileName = argv[1];
	operation = argv[2];
	user_rad_range = stoi(argv[3], nullptr);
	user_id = argv[4];
	if(readFile()){
		cout << "readFile 1 " << endl;
		return 1;
	}

	// don't allow images with too many pixels, even if it's file size is under 8mb
	if(width*height > 4000*6000){
		return 1;
	}
	// don't allow user to enter a radius that is too large
	else if(user_rad_range != 0 && width*height/(4*(ll)pow(user_rad_range,2)) < 300){
		return 1;
	}
	modify();
	if(writeFile()){
		return 1;
	}
	cout << "sucess 0 "<< endl;
	return 0;
}
// function to read in the ppm, 0 for success, 1 for failure
int readFile(){
	ifstream in(fileName, ios::binary);
	if(in.fail()){
		return 1;
	}
	string format = "";
	in >> format;
	if(format != "P6"){
		return 1;
	}
	// we don't care about comments because we can use convert's -strip flag to remove them
	in >> width;
	in >> height;
	in >> max_val;
	if(!in.good()){
		return 1;
	}
	// I have never seen a ppm with max color value of 65355 even though it is stated they are supported on the Netpbm website
	if(max_val > 255){
		return 1;
	}
	vec.resize(width*height);
	// Netpbm specifies that one white space character should follow after the max color value so we need to get rid of it
	in.get();
	// read all of the pixel data bytes into a vector of pixels
	in.read((char*)&vec[0], vec.size() * 3);
	//should trigger eof flag
	in.get();
	if(!in.eof()){
		return 1;
	}
	return 0;
}

int writeFile(){
	// write the file to this directory with the filename being after_{operation name}.ppm
	string outFileName = "./uploads/dir" + user_id + "/after_" + operation +".ppm";
	cout << outFileName << endl;
	ofstream out(outFileName, ios::binary);
	if(!out.is_open()){
		cout << "couldn't open" << endl;
		return 1;
	}
	out << "P6" << endl;
	out << width << " " << height << endl;
	out << max_val << endl;
	// write out all the pixel data bytes to the file
	out.write((char*)&vec[0], vec.size() * 3);
	return 0;
}

void modify(){
	// maximum possible radius, minimum is 1
	int rad_range;
	if(user_rad_range <= 0){
		if(operation == "pointillism"){
			rad_range = ceil(sqrt((double)min(width, height)/(double)600) * 5);
		}else if(operation == "rectanglism"){
			rad_range = ceil(sqrt((double)min(width, height)/(double)600) * 5);
		}else if(operation == "hexagonism"){
			rad_range = ceil(sqrt((double)min(width, height)/(double)525) * 5);
		}else if(operation == "trianglism"){
			rad_range = ceil(sqrt((double)min(width, height)/(double)400) * 5);
		}
	}else{
		rad_range = user_rad_range;
	}
	for(int i = 0; i < (ll)(width*height*0.03); i++){
		// choose a random pixel
		int col = rand()%width;
		int row = rand()%height;
		int r = rand()%rad_range + 1;
		
		if(operation == "pointillism"){
			circle(row, col, r);
		}else if(operation == "rectanglism"){
			rectangle(row, col, r);
		}else if(operation == "hexagonism"){
			hexagon(row, col, r);
		}else if(operation == "trianglism"){
			triangle(row, col, r);
		}
	}
}

// within a 2r+1 by 2r+1 square, override all pixels within r distance from the center pixel with the colors of the center pixel
void circle(int row, int col, int r){
	for(int i = (row-r<0?0:row-r); i < (row+r+1 > height?height:row+r+1); i++){ // makes sure the random row exists, aka not negative and not greater than the number of rows in the ppm
		for(int j = (col-r<0?0:col-r); j < (col+r+1 > width?width:col+r+1); j++){ // same as above except for columns
			if((row-i)*(row-i) + (col-j)*(col-j) <= r*r){
				vec[i*width+j].r = vec[row*width + col].r;
				vec[i*width+j].g = vec[row*width + col].g;
				vec[i*width+j].b = vec[row*width + col].b;
			}
		}
   }
}

// within a rectangle of size based on the r value, override all pixels with the colors of the center pixel
void rectangle(int row, int col, int r){
	int r1 = r/3;
	int r2 = r*2;
	for(int i = (row-r1<0?0:row-r1); i < (row+r1+1 > height?height:row+r1+1); i++){ // makes sure the random row exists, aka not negative and not greater than the number of rows in the ppm
		for(int j = (col-r2<0?0:col-r2); j < (col+r2+1 > width?width:col+r2+1); j++){ // same as above except for columns
			vec[i*width+j].r = vec[row*width + col].r;
			vec[i*width+j].g = vec[row*width + col].g;
			vec[i*width+j].b = vec[row*width + col].b;
		}
   }
}
// overrides all pixels within a triangle of 2r+1 height with the colors of the center pixel
void triangle(int row, int col, int r){
	int counter = 0;
	int sub = r;
	for(int i = (row-r<0?0:row-r); i < (row+r+1 > height?height:row+r+1); i++){ // makes sure the random row exists, aka not negative and not greater than the number of rows in the ppm
		// every other row, we increase the number of columns overriden by 2, 1 on either side
		for(int j = (col-r+sub<0?0:col-r+sub); j < (col+r+1-sub > width?width:col+r+1-sub); j++){ // same as above except for columns
			vec[i*width+j].r = vec[row*width + col].r;
			vec[i*width+j].g = vec[row*width + col].g;
			vec[i*width+j].b = vec[row*width + col].b;
		}
		counter++;
		if(counter % 2 == 0){
			sub--;
		}
   }
}
// overrides all pixels within a hexagon constrcuted within a 2r+1 by 2r+1 square s.t. it's sides are parallel with the verticle sides of the square
void hexagon(int row, int col, int r){
	// the length of each side of the hexagon is given by this formula, can be verified using the law of sines
	int sideLength = (int)floor((2*(double)r)/sqrt(3));
	// the side length has to be odd two ensure there is the same number of rows on either side of the center row
	if(sideLength%2 == 0){
		sideLength++;
	}
	// height of the triangle above the reactangle part of the hexagon
	int triHeight = ((2*r+1) - sideLength)/2;
	// the number of additional columns on either side of the triangle for each successive row
	int incPerLayer = r/triHeight;
	// if the addition of columns cannot be evenly distributed, the rows nearer to the rectangle get 1 extra column on each side
	int extra = r % triHeight;
	int sub = r;
	// create the top triangle
	for(int i = (row-r<0?0:row-r); i < (row-r+triHeight > height?height:row-r+triHeight); i++){ // makes sure the random row exists, aka not negative and not greater than the number of rows in the ppm
		for(int j = (col-r+sub<0?0:col-r+sub); j < (col+r+1-sub > width?width:col+r+1-sub); j++){ // same as above except for columns
			vec[i*width+j].r = vec[row*width + col].r;
			vec[i*width+j].g = vec[row*width + col].g;
			vec[i*width+j].b = vec[row*width + col].b;
		}
		sub -= incPerLayer;
		if(i -(row-r) >= triHeight-extra){
			sub --;
		}
   }
   // create the rectangle body
   for(int i = (row-r + triHeight<0?0:row-r+triHeight); i < (row+r+1-triHeight > height?height:row+r+1-triHeight); i++){ // makes sure the random row exists, aka not negative and not greater than the number of rows in the ppm
		for(int j = (col-r<0?0:col-r); j < (col+r+1 > width?width:col+r+1); j++){ // same as above except for columns
			vec[i*width+j].r = vec[row*width + col].r;
			vec[i*width+j].g = vec[row*width + col].g;
			vec[i*width+j].b = vec[row*width + col].b;
		}
   }
   // create the bottom triangle
   sub = 0;
   for(int i = (row+r+1-triHeight<0?0:row+r+1-triHeight); i < (row+r+1 > height?height:row+r+1); i++){ // makes sure the random row exists, aka not negative and not greater than the number of rows in the ppm
		if(i < (row+r+1-triHeight)+extra){
			sub++;
		}
		sub += incPerLayer;
		for(int j = (col-r+sub<0?0:col-r+sub); j < (col+r+1-sub > width?width:col+r+1-sub); j++){ // same as above except for columns
			vec[i*width+j].r = vec[row*width + col].r;
			vec[i*width+j].g = vec[row*width + col].g;
			vec[i*width+j].b = vec[row*width + col].b;
		}
   }
}