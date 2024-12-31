// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.34.2
// 	protoc        v3.20.0
// source: face.proto

package event

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

type BoxType int32

const (
	BoxType_XYXY BoxType = 0
	BoxType_XYWH BoxType = 1
)

// Enum value maps for BoxType.
var (
	BoxType_name = map[int32]string{
		0: "XYXY",
		1: "XYWH",
	}
	BoxType_value = map[string]int32{
		"XYXY": 0,
		"XYWH": 1,
	}
)

func (x BoxType) Enum() *BoxType {
	p := new(BoxType)
	*p = x
	return p
}

func (x BoxType) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (BoxType) Descriptor() protoreflect.EnumDescriptor {
	return file_face_proto_enumTypes[0].Descriptor()
}

func (BoxType) Type() protoreflect.EnumType {
	return &file_face_proto_enumTypes[0]
}

func (x BoxType) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use BoxType.Descriptor instead.
func (BoxType) EnumDescriptor() ([]byte, []int) {
	return file_face_proto_rawDescGZIP(), []int{0}
}

type BoundingBox struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Score float32 `protobuf:"fixed32,1,opt,name=score,proto3" json:"score,omitempty"`
	Type  BoxType `protobuf:"varint,2,opt,name=type,proto3,enum=common.BoxType" json:"type,omitempty"`
	P1    float32 `protobuf:"fixed32,3,opt,name=p1,proto3" json:"p1,omitempty"`
	P2    float32 `protobuf:"fixed32,4,opt,name=p2,proto3" json:"p2,omitempty"`
	P3    float32 `protobuf:"fixed32,5,opt,name=p3,proto3" json:"p3,omitempty"`
	P4    float32 `protobuf:"fixed32,6,opt,name=p4,proto3" json:"p4,omitempty"`
}

func (x *BoundingBox) Reset() {
	*x = BoundingBox{}
	if protoimpl.UnsafeEnabled {
		mi := &file_face_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *BoundingBox) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*BoundingBox) ProtoMessage() {}

func (x *BoundingBox) ProtoReflect() protoreflect.Message {
	mi := &file_face_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use BoundingBox.ProtoReflect.Descriptor instead.
func (*BoundingBox) Descriptor() ([]byte, []int) {
	return file_face_proto_rawDescGZIP(), []int{0}
}

func (x *BoundingBox) GetScore() float32 {
	if x != nil {
		return x.Score
	}
	return 0
}

func (x *BoundingBox) GetType() BoxType {
	if x != nil {
		return x.Type
	}
	return BoxType_XYXY
}

func (x *BoundingBox) GetP1() float32 {
	if x != nil {
		return x.P1
	}
	return 0
}

func (x *BoundingBox) GetP2() float32 {
	if x != nil {
		return x.P2
	}
	return 0
}

func (x *BoundingBox) GetP3() float32 {
	if x != nil {
		return x.P3
	}
	return 0
}

func (x *BoundingBox) GetP4() float32 {
	if x != nil {
		return x.P4
	}
	return 0
}

type Angle struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Pitch float32 `protobuf:"fixed32,1,opt,name=pitch,proto3" json:"pitch,omitempty"`
	Yaw   float32 `protobuf:"fixed32,2,opt,name=yaw,proto3" json:"yaw,omitempty"`
	Roll  float32 `protobuf:"fixed32,3,opt,name=roll,proto3" json:"roll,omitempty"`
}

func (x *Angle) Reset() {
	*x = Angle{}
	if protoimpl.UnsafeEnabled {
		mi := &file_face_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Angle) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Angle) ProtoMessage() {}

func (x *Angle) ProtoReflect() protoreflect.Message {
	mi := &file_face_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Angle.ProtoReflect.Descriptor instead.
func (*Angle) Descriptor() ([]byte, []int) {
	return file_face_proto_rawDescGZIP(), []int{1}
}

func (x *Angle) GetPitch() float32 {
	if x != nil {
		return x.Pitch
	}
	return 0
}

func (x *Angle) GetYaw() float32 {
	if x != nil {
		return x.Yaw
	}
	return 0
}

func (x *Angle) GetRoll() float32 {
	if x != nil {
		return x.Roll
	}
	return 0
}

type Embedding struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Vector []float64 `protobuf:"fixed64,1,rep,packed,name=vector,proto3" json:"vector,omitempty"`
}

func (x *Embedding) Reset() {
	*x = Embedding{}
	if protoimpl.UnsafeEnabled {
		mi := &file_face_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Embedding) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Embedding) ProtoMessage() {}

func (x *Embedding) ProtoReflect() protoreflect.Message {
	mi := &file_face_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Embedding.ProtoReflect.Descriptor instead.
func (*Embedding) Descriptor() ([]byte, []int) {
	return file_face_proto_rawDescGZIP(), []int{2}
}

func (x *Embedding) GetVector() []float64 {
	if x != nil {
		return x.Vector
	}
	return nil
}

type Face struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	ObjectId      int64        `protobuf:"varint,1,opt,name=objectId,proto3" json:"objectId,omitempty"`
	Bbox          *BoundingBox `protobuf:"bytes,2,opt,name=bbox,proto3" json:"bbox,omitempty"`
	Embedding     *Embedding   `protobuf:"bytes,3,opt,name=embedding,proto3" json:"embedding,omitempty"`
	FaceImage     []byte       `protobuf:"bytes,4,opt,name=face_image,json=faceImage,proto3" json:"face_image,omitempty"`
	FaceThumbnail []byte       `protobuf:"bytes,5,opt,name=face_thumbnail,json=faceThumbnail,proto3" json:"face_thumbnail,omitempty"`
	PersonId      string       `protobuf:"bytes,6,opt,name=person_id,json=personId,proto3" json:"person_id,omitempty"`
	Score         float32      `protobuf:"fixed32,7,opt,name=score,proto3" json:"score,omitempty"`
	Timestamp     int64        `protobuf:"varint,8,opt,name=timestamp,proto3" json:"timestamp,omitempty"`
}

func (x *Face) Reset() {
	*x = Face{}
	if protoimpl.UnsafeEnabled {
		mi := &file_face_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Face) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Face) ProtoMessage() {}

func (x *Face) ProtoReflect() protoreflect.Message {
	mi := &file_face_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Face.ProtoReflect.Descriptor instead.
func (*Face) Descriptor() ([]byte, []int) {
	return file_face_proto_rawDescGZIP(), []int{3}
}

func (x *Face) GetObjectId() int64 {
	if x != nil {
		return x.ObjectId
	}
	return 0
}

func (x *Face) GetBbox() *BoundingBox {
	if x != nil {
		return x.Bbox
	}
	return nil
}

func (x *Face) GetEmbedding() *Embedding {
	if x != nil {
		return x.Embedding
	}
	return nil
}

func (x *Face) GetFaceImage() []byte {
	if x != nil {
		return x.FaceImage
	}
	return nil
}

func (x *Face) GetFaceThumbnail() []byte {
	if x != nil {
		return x.FaceThumbnail
	}
	return nil
}

func (x *Face) GetPersonId() string {
	if x != nil {
		return x.PersonId
	}
	return ""
}

func (x *Face) GetScore() float32 {
	if x != nil {
		return x.Score
	}
	return 0
}

func (x *Face) GetTimestamp() int64 {
	if x != nil {
		return x.Timestamp
	}
	return 0
}

var File_face_proto protoreflect.FileDescriptor

var file_face_proto_rawDesc = []byte{
	0x0a, 0x0a, 0x66, 0x61, 0x63, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x06, 0x63, 0x6f,
	0x6d, 0x6d, 0x6f, 0x6e, 0x22, 0x88, 0x01, 0x0a, 0x0b, 0x42, 0x6f, 0x75, 0x6e, 0x64, 0x69, 0x6e,
	0x67, 0x42, 0x6f, 0x78, 0x12, 0x14, 0x0a, 0x05, 0x73, 0x63, 0x6f, 0x72, 0x65, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x02, 0x52, 0x05, 0x73, 0x63, 0x6f, 0x72, 0x65, 0x12, 0x23, 0x0a, 0x04, 0x74, 0x79,
	0x70, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x0f, 0x2e, 0x63, 0x6f, 0x6d, 0x6d, 0x6f,
	0x6e, 0x2e, 0x42, 0x6f, 0x78, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x12,
	0x0e, 0x0a, 0x02, 0x70, 0x31, 0x18, 0x03, 0x20, 0x01, 0x28, 0x02, 0x52, 0x02, 0x70, 0x31, 0x12,
	0x0e, 0x0a, 0x02, 0x70, 0x32, 0x18, 0x04, 0x20, 0x01, 0x28, 0x02, 0x52, 0x02, 0x70, 0x32, 0x12,
	0x0e, 0x0a, 0x02, 0x70, 0x33, 0x18, 0x05, 0x20, 0x01, 0x28, 0x02, 0x52, 0x02, 0x70, 0x33, 0x12,
	0x0e, 0x0a, 0x02, 0x70, 0x34, 0x18, 0x06, 0x20, 0x01, 0x28, 0x02, 0x52, 0x02, 0x70, 0x34, 0x22,
	0x43, 0x0a, 0x05, 0x41, 0x6e, 0x67, 0x6c, 0x65, 0x12, 0x14, 0x0a, 0x05, 0x70, 0x69, 0x74, 0x63,
	0x68, 0x18, 0x01, 0x20, 0x01, 0x28, 0x02, 0x52, 0x05, 0x70, 0x69, 0x74, 0x63, 0x68, 0x12, 0x10,
	0x0a, 0x03, 0x79, 0x61, 0x77, 0x18, 0x02, 0x20, 0x01, 0x28, 0x02, 0x52, 0x03, 0x79, 0x61, 0x77,
	0x12, 0x12, 0x0a, 0x04, 0x72, 0x6f, 0x6c, 0x6c, 0x18, 0x03, 0x20, 0x01, 0x28, 0x02, 0x52, 0x04,
	0x72, 0x6f, 0x6c, 0x6c, 0x22, 0x23, 0x0a, 0x09, 0x45, 0x6d, 0x62, 0x65, 0x64, 0x64, 0x69, 0x6e,
	0x67, 0x12, 0x16, 0x0a, 0x06, 0x76, 0x65, 0x63, 0x74, 0x6f, 0x72, 0x18, 0x01, 0x20, 0x03, 0x28,
	0x01, 0x52, 0x06, 0x76, 0x65, 0x63, 0x74, 0x6f, 0x72, 0x22, 0x93, 0x02, 0x0a, 0x04, 0x46, 0x61,
	0x63, 0x65, 0x12, 0x1a, 0x0a, 0x08, 0x6f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x49, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x03, 0x52, 0x08, 0x6f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x49, 0x64, 0x12, 0x27,
	0x0a, 0x04, 0x62, 0x62, 0x6f, 0x78, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x13, 0x2e, 0x63,
	0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x42, 0x6f, 0x75, 0x6e, 0x64, 0x69, 0x6e, 0x67, 0x42, 0x6f,
	0x78, 0x52, 0x04, 0x62, 0x62, 0x6f, 0x78, 0x12, 0x2f, 0x0a, 0x09, 0x65, 0x6d, 0x62, 0x65, 0x64,
	0x64, 0x69, 0x6e, 0x67, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x11, 0x2e, 0x63, 0x6f, 0x6d,
	0x6d, 0x6f, 0x6e, 0x2e, 0x45, 0x6d, 0x62, 0x65, 0x64, 0x64, 0x69, 0x6e, 0x67, 0x52, 0x09, 0x65,
	0x6d, 0x62, 0x65, 0x64, 0x64, 0x69, 0x6e, 0x67, 0x12, 0x1d, 0x0a, 0x0a, 0x66, 0x61, 0x63, 0x65,
	0x5f, 0x69, 0x6d, 0x61, 0x67, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x09, 0x66, 0x61,
	0x63, 0x65, 0x49, 0x6d, 0x61, 0x67, 0x65, 0x12, 0x25, 0x0a, 0x0e, 0x66, 0x61, 0x63, 0x65, 0x5f,
	0x74, 0x68, 0x75, 0x6d, 0x62, 0x6e, 0x61, 0x69, 0x6c, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0c, 0x52,
	0x0d, 0x66, 0x61, 0x63, 0x65, 0x54, 0x68, 0x75, 0x6d, 0x62, 0x6e, 0x61, 0x69, 0x6c, 0x12, 0x1b,
	0x0a, 0x09, 0x70, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x5f, 0x69, 0x64, 0x18, 0x06, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x08, 0x70, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x49, 0x64, 0x12, 0x14, 0x0a, 0x05, 0x73,
	0x63, 0x6f, 0x72, 0x65, 0x18, 0x07, 0x20, 0x01, 0x28, 0x02, 0x52, 0x05, 0x73, 0x63, 0x6f, 0x72,
	0x65, 0x12, 0x1c, 0x0a, 0x09, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x18, 0x08,
	0x20, 0x01, 0x28, 0x03, 0x52, 0x09, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x2a,
	0x1d, 0x0a, 0x07, 0x42, 0x6f, 0x78, 0x54, 0x79, 0x70, 0x65, 0x12, 0x08, 0x0a, 0x04, 0x58, 0x59,
	0x58, 0x59, 0x10, 0x00, 0x12, 0x08, 0x0a, 0x04, 0x58, 0x59, 0x57, 0x48, 0x10, 0x01, 0x42, 0x0d,
	0x5a, 0x0b, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x62, 0x06, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_face_proto_rawDescOnce sync.Once
	file_face_proto_rawDescData = file_face_proto_rawDesc
)

func file_face_proto_rawDescGZIP() []byte {
	file_face_proto_rawDescOnce.Do(func() {
		file_face_proto_rawDescData = protoimpl.X.CompressGZIP(file_face_proto_rawDescData)
	})
	return file_face_proto_rawDescData
}

var file_face_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_face_proto_msgTypes = make([]protoimpl.MessageInfo, 4)
var file_face_proto_goTypes = []any{
	(BoxType)(0),        // 0: common.BoxType
	(*BoundingBox)(nil), // 1: common.BoundingBox
	(*Angle)(nil),       // 2: common.Angle
	(*Embedding)(nil),   // 3: common.Embedding
	(*Face)(nil),        // 4: common.Face
}
var file_face_proto_depIdxs = []int32{
	0, // 0: common.BoundingBox.type:type_name -> common.BoxType
	1, // 1: common.Face.bbox:type_name -> common.BoundingBox
	3, // 2: common.Face.embedding:type_name -> common.Embedding
	3, // [3:3] is the sub-list for method output_type
	3, // [3:3] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_face_proto_init() }
func file_face_proto_init() {
	if File_face_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_face_proto_msgTypes[0].Exporter = func(v any, i int) any {
			switch v := v.(*BoundingBox); i {
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
		file_face_proto_msgTypes[1].Exporter = func(v any, i int) any {
			switch v := v.(*Angle); i {
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
		file_face_proto_msgTypes[2].Exporter = func(v any, i int) any {
			switch v := v.(*Embedding); i {
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
		file_face_proto_msgTypes[3].Exporter = func(v any, i int) any {
			switch v := v.(*Face); i {
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
			RawDescriptor: file_face_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   4,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_face_proto_goTypes,
		DependencyIndexes: file_face_proto_depIdxs,
		EnumInfos:         file_face_proto_enumTypes,
		MessageInfos:      file_face_proto_msgTypes,
	}.Build()
	File_face_proto = out.File
	file_face_proto_rawDesc = nil
	file_face_proto_goTypes = nil
	file_face_proto_depIdxs = nil
}
