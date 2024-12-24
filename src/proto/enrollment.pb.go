// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.34.2
// 	protoc        v3.20.0
// source: enrollment.proto

package common

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type Type int32

const (
	Type_Video Type = 0
	Type_Image Type = 1
)

// Enum value maps for Type.
var (
	Type_name = map[int32]string{
		0: "Video",
		1: "Image",
	}
	Type_value = map[string]int32{
		"Video": 0,
		"Image": 1,
	}
)

func (x Type) Enum() *Type {
	p := new(Type)
	*p = x
	return p
}

func (x Type) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (Type) Descriptor() protoreflect.EnumDescriptor {
	return file_enrollment_proto_enumTypes[0].Descriptor()
}

func (Type) Type() protoreflect.EnumType {
	return &file_enrollment_proto_enumTypes[0]
}

func (x Type) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use Type.Descriptor instead.
func (Type) EnumDescriptor() ([]byte, []int) {
	return file_enrollment_proto_rawDescGZIP(), []int{0}
}

type ImageFile struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Path string `protobuf:"bytes,1,opt,name=path,proto3" json:"path,omitempty"`
}

func (x *ImageFile) Reset() {
	*x = ImageFile{}
	if protoimpl.UnsafeEnabled {
		mi := &file_enrollment_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ImageFile) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ImageFile) ProtoMessage() {}

func (x *ImageFile) ProtoReflect() protoreflect.Message {
	mi := &file_enrollment_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ImageFile.ProtoReflect.Descriptor instead.
func (*ImageFile) Descriptor() ([]byte, []int) {
	return file_enrollment_proto_rawDescGZIP(), []int{0}
}

func (x *ImageFile) GetPath() string {
	if x != nil {
		return x.Path
	}
	return ""
}

type Enrollment struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	SessionId string       `protobuf:"bytes,1,opt,name=session_id,json=sessionId,proto3" json:"session_id,omitempty"`
	Type      Type         `protobuf:"varint,2,opt,name=type,proto3,enum=Type" json:"type,omitempty"`
	VideoPath string       `protobuf:"bytes,3,opt,name=video_path,json=videoPath,proto3" json:"video_path,omitempty"`
	Images    []*ImageFile `protobuf:"bytes,4,rep,name=images,proto3" json:"images,omitempty"`
}

func (x *Enrollment) Reset() {
	*x = Enrollment{}
	if protoimpl.UnsafeEnabled {
		mi := &file_enrollment_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Enrollment) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Enrollment) ProtoMessage() {}

func (x *Enrollment) ProtoReflect() protoreflect.Message {
	mi := &file_enrollment_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Enrollment.ProtoReflect.Descriptor instead.
func (*Enrollment) Descriptor() ([]byte, []int) {
	return file_enrollment_proto_rawDescGZIP(), []int{1}
}

func (x *Enrollment) GetSessionId() string {
	if x != nil {
		return x.SessionId
	}
	return ""
}

func (x *Enrollment) GetType() Type {
	if x != nil {
		return x.Type
	}
	return Type_Video
}

func (x *Enrollment) GetVideoPath() string {
	if x != nil {
		return x.VideoPath
	}
	return ""
}

func (x *Enrollment) GetImages() []*ImageFile {
	if x != nil {
		return x.Images
	}
	return nil
}

var File_enrollment_proto protoreflect.FileDescriptor

var file_enrollment_proto_rawDesc = []byte{
	0x0a, 0x10, 0x65, 0x6e, 0x72, 0x6f, 0x6c, 0x6c, 0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x22, 0x1f, 0x0a, 0x09, 0x49, 0x6d, 0x61, 0x67, 0x65, 0x46, 0x69, 0x6c, 0x65, 0x12,
	0x12, 0x0a, 0x04, 0x70, 0x61, 0x74, 0x68, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x70,
	0x61, 0x74, 0x68, 0x22, 0x89, 0x01, 0x0a, 0x0a, 0x45, 0x6e, 0x72, 0x6f, 0x6c, 0x6c, 0x6d, 0x65,
	0x6e, 0x74, 0x12, 0x1d, 0x0a, 0x0a, 0x73, 0x65, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x5f, 0x69, 0x64,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x73, 0x65, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x49,
	0x64, 0x12, 0x19, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0e, 0x32,
	0x05, 0x2e, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x12, 0x1d, 0x0a, 0x0a,
	0x76, 0x69, 0x64, 0x65, 0x6f, 0x5f, 0x70, 0x61, 0x74, 0x68, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x09, 0x76, 0x69, 0x64, 0x65, 0x6f, 0x50, 0x61, 0x74, 0x68, 0x12, 0x22, 0x0a, 0x06, 0x69,
	0x6d, 0x61, 0x67, 0x65, 0x73, 0x18, 0x04, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x0a, 0x2e, 0x49, 0x6d,
	0x61, 0x67, 0x65, 0x46, 0x69, 0x6c, 0x65, 0x52, 0x06, 0x69, 0x6d, 0x61, 0x67, 0x65, 0x73, 0x2a,
	0x1c, 0x0a, 0x04, 0x54, 0x79, 0x70, 0x65, 0x12, 0x09, 0x0a, 0x05, 0x56, 0x69, 0x64, 0x65, 0x6f,
	0x10, 0x00, 0x12, 0x09, 0x0a, 0x05, 0x49, 0x6d, 0x61, 0x67, 0x65, 0x10, 0x01, 0x42, 0x0e, 0x5a,
	0x0c, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x62, 0x06, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_enrollment_proto_rawDescOnce sync.Once
	file_enrollment_proto_rawDescData = file_enrollment_proto_rawDesc
)

func file_enrollment_proto_rawDescGZIP() []byte {
	file_enrollment_proto_rawDescOnce.Do(func() {
		file_enrollment_proto_rawDescData = protoimpl.X.CompressGZIP(file_enrollment_proto_rawDescData)
	})
	return file_enrollment_proto_rawDescData
}

var file_enrollment_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_enrollment_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_enrollment_proto_goTypes = []any{
	(Type)(0),          // 0: Type
	(*ImageFile)(nil),  // 1: ImageFile
	(*Enrollment)(nil), // 2: Enrollment
}
var file_enrollment_proto_depIdxs = []int32{
	0, // 0: Enrollment.type:type_name -> Type
	1, // 1: Enrollment.images:type_name -> ImageFile
	2, // [2:2] is the sub-list for method output_type
	2, // [2:2] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_enrollment_proto_init() }
func file_enrollment_proto_init() {
	if File_enrollment_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_enrollment_proto_msgTypes[0].Exporter = func(v any, i int) any {
			switch v := v.(*ImageFile); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_enrollment_proto_msgTypes[1].Exporter = func(v any, i int) any {
			switch v := v.(*Enrollment); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_enrollment_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_enrollment_proto_goTypes,
		DependencyIndexes: file_enrollment_proto_depIdxs,
		EnumInfos:         file_enrollment_proto_enumTypes,
		MessageInfos:      file_enrollment_proto_msgTypes,
	}.Build()
	File_enrollment_proto = out.File
	file_enrollment_proto_rawDesc = nil
	file_enrollment_proto_goTypes = nil
	file_enrollment_proto_depIdxs = nil
}
