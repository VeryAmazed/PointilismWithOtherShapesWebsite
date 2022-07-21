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
//typedef basic_ifstream<unsigned char, char_traits<unsigned char> > uifstream;
//typedef basic_ofstream<unsigned char, char_traits<unsigned char> > uofstream;
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

int height;
int width;
int max_val;

vector<pixel> vec;
string fileName;
string operation;

int readFile();
int writeFile();
void modify();
void circle(int row, int col, int r);
void rectangle(int row, int col, int r);
void square(int row, int col, int r);
void triangle(int row, int col, int r);

int main ( int argc, char *argv[] ){
	fileName = argv[1];
	operation = argv[2];
	if(readFile()){
		cout << 1 << endl;
		return 1;
	}
	// use rand() like this, xyz = rand();
	modify();
	if(writeFile()){
		cout << 1 << endl;
		return 1;
	}
	
	return 0;
}

int readFile(){
	ifstream in(fileName, ios::binary);
	if(in.fail()){
		return 1;
	}
	string format = "";
	in >> format;
	if(format != "P6"){
		cout << "here" << endl;
		cout << format << endl;
		return 1;
	}
	// we don't care about comments because we can use convert's -strip flag to remove them
	in >> width;
	in >> height;
	in >> max_val;
	if(!in.good()){
		return 1;
	}
	//cout << width << " " << height << " " << max_val << endl;
	// I have never seen a ppm with max color value of 65355 even though it is stated they are supported on the Netpbm website
	if(max_val > 255){
		return 1;
	}
	vec.resize(width*height);
	// Netpbm specifies that one white space character should follow after the max color value
	in.get();
	in.read((char*)&vec[0], vec.size() * 3);
	//should trigger eof flag
	in.get();
	if(!in.eof()){
		return 1;
	}
	return 0;
}

int writeFile(){
	string outFileName = operation + "_" + fileName;
	ofstream out(outFileName, ios::binary);
	if(!out.is_open()){
		return 1;
	}
	out << "P6" << endl;
	out << width << " " << height << endl;
	out << max_val << endl;
	out.write((char*)&vec[0], vec.size() * 3);
	return 0;
}

void modify(){
	int rad_range;
	if(operation == "pointilism"){
		rad_range = ceil(sqrt((double)min(width, height)/(double)600) * 5);
	}else if(operation == "rectanglism"){
		rad_range = ceil(sqrt((double)min(width, height)/(double)600) * 5);
	}else if(operation == "squarism"){
		rad_range = ceil(sqrt((double)min(width, height)/(double)1000) * 5);
	}else if(operation == "trianglism"){
		rad_range = ceil(sqrt((double)min(width, height)/(double)400) * 5);
	}else{
		return;
	}
	//cout << rad_range << endl;
	for(int i = 0; i < (ll)(width*height*0.03); i++){
		int col = rand()%width;
		int row = rand()%height;
		
		int r = rand()%rad_range + 1;
		if(operation == "pointilism"){
			circle(row, col, r);
		}else if(operation == "rectanglism"){
			rectangle(row, col, r);
		}else if(operation == "squarism"){
			square(row, col, r);
		}else if(operation == "trianglism"){
			triangle(row, col, r);
		}
	}
}

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

void square(int row, int col, int r){
	for(int i = (row-r<0?0:row-r); i < (row+r+1 > height?height:row+r+1); i++){ // makes sure the random row exists, aka not negative and not greater than the number of rows in the ppm
		for(int j = (col-r<0?0:col-r); j < (col+r+1 > width?width:col+r+1); j++){ // same as above except for columns
		
			vec[i*width+j].r = vec[row*width + col].r;
			vec[i*width+j].g = vec[row*width + col].g;
			vec[i*width+j].b = vec[row*width + col].b;
			
		}
   }
}

void triangle(int row, int col, int r){
	int counter = 0;
	int sub = r;
	for(int i = (row-r<0?0:row-r); i < (row+r+1 > height?height:row+r+1); i++){ // makes sure the random row exists, aka not negative and not greater than the number of rows in the ppm
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