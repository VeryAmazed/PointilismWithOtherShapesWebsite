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

unsigned int height;
unsigned int width;
unsigned int max_val;

vector<pixel> vec;
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
	// use rand() like this, xyz = rand();
	
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
	string format;
	in >> format;
	if(format != "P6"){
		cout << format << endl;
		return 1;
	}
	// we don't care about comments because we can use convert's -strip flag to remove them
	in >> width;
	in >> height;
	in >> max_val;
	cout << width << " " << height << " " << max_val << endl;
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
