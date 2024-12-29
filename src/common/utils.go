package common

import "os"

// SaveImage saves a byte slice to an image file
func SaveImage(data []byte, fileName string) error {
	file, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	_, err = file.Write(data)
	if err != nil {
		return err
	}

	return nil
}
