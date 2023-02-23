import { useSelector } from "react-redux";
import axios from 'axios';
import { token } from '../store/tokenSlice.jsx';

export default function SelectImmeuble (){

    const authToken = useSelector(token);

    return (
        <div className="w-80">
            {authToken}
            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selectionner un immeuble</label>
            <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option defaultValue></option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            </select>
        </div>
    );
}