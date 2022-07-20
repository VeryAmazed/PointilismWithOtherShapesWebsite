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

class Pixel{
	public:
		unsigned char r;
		unsigned char g;
		unsigned char b;
};

int height;
int width;
int max_val;

vector<vector<Pixel>> vec;
string fileName;
string operation;

int readFile();
int writeFile();


int main ( int argc, char *argv[] ){
	fileName = argv[1];
	operation = argv[2];
	if(readFile()){
		cout << 1 << endl;
		return 1;
	}
	if(writeFile()){
		cout << 1 << endl;
		return 1;
	}
	return 0;
}

int readFile(){
	ifstream in(fileName, ios::in | ios::binary);
	string header;
	in >> header;
	// Netpbm programs generate raw PPM files by default
	if(header != "P6"){
		cout << header << endl;
		return 1;
	}	
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
	for(int i =0; i < height; i++){
		vector<Pixel> pixels;
		for(int k = 0; k < width; k++){
			Pixel temp;
			in >> temp.r;
			in >> temp.g;
			// put here because if nothing gets read, the program doesn't crash and we want the eof bit to be set after the last pixel is read
			if(in.eof()){
				return 1;
			}
			in >> temp.b;
			pixels.pb(temp);
			//cout << temp.r << " " << temp.g << " " << temp.b << " ";
		}
		vec.pb(pixels);
		//cout << endl;
	}
	if(!in.good()){
		return 1;
	}else{
		in.close();
		return 0;
	}
}

int writeFile(){
	string outFileName = operation + "_" + fileName;
	ofstream out(outFileName, ios::out | ios::binary);
	if(!out.is_open()){
		return 1;
	}
	out << "P6" << endl;
	out << width << " " << height << endl;
	out << max_val << endl;
	for(int i =0; i < height; i++){
		for(int j = 0; j < width; j++){
			out << vec[i][j].r;
			out << vec[i][j].g;
			out << vec[i][j].b;
		}
	}
	return 0;
}