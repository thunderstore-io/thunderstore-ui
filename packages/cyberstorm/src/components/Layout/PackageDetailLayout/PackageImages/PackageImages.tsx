interface PackageImage {
  alt: string;
  imageSource?: string;
}

export interface PackageImagesProps {
  images: PackageImage[];
}

/**
 * Cyberstorm PackageDetail Layout
 */
export function PackageImages(props: PackageImagesProps) {
  const { images } = props;
  return (
    <>
      {images.map((image, index) => {
        return (
          <img key={index.toString()} src={image.imageSource} alt={image.alt} />
        );
      })}
    </>
  );
}

PackageImages.displayName = "PackageImages";
