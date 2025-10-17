import ClickOutside from "@/components/ClickOutside";
import { Cameras } from "@/types/Cameras"; // Adjust this import according to your file structure
import { Icons } from "@/images/Icons";

// Updated interface to include handleViewCamera
interface CameraModelViewProps {
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
    cameraData?: Cameras; // Keep this optional
    handleViewCamera: (cameraData: Cameras, id: string) => void; // Add this line
}

const CameraModelView = ({ modalOpen, setModalOpen, cameraData, handleViewCamera }: CameraModelViewProps) => {
    console.log(cameraData, "CameraData");

    return (
        <div>
            {modalOpen && cameraData && ( // Ensure cameraData is defined before rendering
                <div
                    className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-[#27918f36] px-4 py-5`}
                >
                    <ClickOutside onClick={() => setModalOpen(false)} className="w-[900px]">
                        <div className="w-full max-w-[1350px] rounded-[15px] bg-white px-6 py-8 shadow-3 dark:bg-gray-dark dark:shadow-card md:px-8 md:py-8">
                            <div
                                className="mb-2 flex cursor-pointer justify-end"
                                onClick={() => setModalOpen(false)}
                            >
                                <Icons.closeIcon />
                            </div>
                            <div className="pb-6">
                                <h2 className="text-lg font-semibold">Camera Details</h2>
                            </div>
                            <table className="w-full text-left text-sm text-gray-500">
                                <tbody className="text-gray-900 dark:text-gray-300">
                                    <tr>
                                        <td className="font-bold p-2">Camera Model</td>
                                        <td>{cameraData.cameraModel}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold p-2">Camera IP</td>
                                        <td>{cameraData.cameraIp}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold p-2">Username</td>
                                        <td>{cameraData.cameraUsername}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold p-2">Location</td>
                                        <td>{cameraData.cameraLocation}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold p-2">Status</td>
                                        <td>{cameraData.cameraStatus}</td>
                                    </tr>
                                    {cameraData.autoFlash !== undefined && (
                                        <tr>
                                            <td className="font-bold p-2">Auto Flash</td>
                                            <td>{cameraData.autoFlash ? 'Enabled' : 'Disabled'}</td>
                                        </tr>
                                    )}
                                    {cameraData.cameraVoice !== undefined && (
                                        <tr>
                                            <td className="font-bold p-2">Voice</td>
                                            <td>{cameraData.cameraVoice ? 'Enabled' : 'Disabled'}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td className="font-bold p-2">Created At</td>
                                        <td>{cameraData.createdAt}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold p-2">Updated At</td>
                                        <td>{cameraData.updatedAt}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ClickOutside>
                </div>
            )}
        </div>
    );
};

export default CameraModelView;
