// This file was generated by Mendix Studio Pro.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package tasktracker.proxies;

public class Comment implements com.mendix.systemwideinterfaces.core.IEntityProxy
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject commentMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "TaskTracker.Comment";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		Content("Content"),
		Comment_Task("TaskTracker.Comment_Task"),
		Comment_TeamMember("TaskTracker.Comment_TeamMember"),
		Comment_MendixSSOUser("TaskTracker.Comment_MendixSSOUser");

		private final java.lang.String metaName;

		MemberNames(java.lang.String s)
		{
			metaName = s;
		}

		@java.lang.Override
		public java.lang.String toString()
		{
			return metaName;
		}
	}

	public Comment(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, entityName));
	}

	protected Comment(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject commentMendixObject)
	{
		if (commentMendixObject == null) {
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		}
		if (!com.mendix.core.Core.isSubClassOf(entityName, commentMendixObject.getType())) {
			throw new java.lang.IllegalArgumentException(String.format("The given object is not a %s", entityName));
		}	

		this.commentMendixObject = commentMendixObject;
		this.context = context;
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.createSudoClone() can be used to obtain sudo access).
	 * @param context The context to be used
	 * @param mendixObject The Mendix object for the new instance
	 * @return a new instance of this proxy class
	 */
	public static tasktracker.proxies.Comment initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new tasktracker.proxies.Comment(context, mendixObject);
	}

	public static tasktracker.proxies.Comment load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return tasktracker.proxies.Comment.initialize(context, mendixObject);
	}

	public static java.util.List<tasktracker.proxies.Comment> load(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String xpathConstraint) throws com.mendix.core.CoreException
	{
		return com.mendix.core.Core.createXPathQuery(String.format("//%1$s%2$s", entityName, xpathConstraint))
			.execute(context)
			.stream()
			.map(obj -> tasktracker.proxies.Comment.initialize(context, obj))
			.collect(java.util.stream.Collectors.toList());
	}

	/**
	 * @return value of Content
	 */
	public final java.lang.String getContent()
	{
		return getContent(getContext());
	}

	/**
	 * @param context
	 * @return value of Content
	 */
	public final java.lang.String getContent(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Content.toString());
	}

	/**
	 * Set value of Content
	 * @param content
	 */
	public final void setContent(java.lang.String content)
	{
		setContent(getContext(), content);
	}

	/**
	 * Set value of Content
	 * @param context
	 * @param content
	 */
	public final void setContent(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String content)
	{
		getMendixObject().setValue(context, MemberNames.Content.toString(), content);
	}

	/**
	 * @throws com.mendix.core.CoreException
	 * @return value of Comment_Task
	 */
	public final tasktracker.proxies.Task getComment_Task() throws com.mendix.core.CoreException
	{
		return getComment_Task(getContext());
	}

	/**
	 * @param context
	 * @return value of Comment_Task
	 * @throws com.mendix.core.CoreException
	 */
	public final tasktracker.proxies.Task getComment_Task(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		tasktracker.proxies.Task result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.Comment_Task.toString());
		if (identifier != null) {
			result = tasktracker.proxies.Task.load(context, identifier);
		}
		return result;
	}

	/**
	 * Set value of Comment_Task
	 * @param comment_task
	 */
	public final void setComment_Task(tasktracker.proxies.Task comment_task)
	{
		setComment_Task(getContext(), comment_task);
	}

	/**
	 * Set value of Comment_Task
	 * @param context
	 * @param comment_task
	 */
	public final void setComment_Task(com.mendix.systemwideinterfaces.core.IContext context, tasktracker.proxies.Task comment_task)
	{
		if (comment_task == null) {
			getMendixObject().setValue(context, MemberNames.Comment_Task.toString(), null);
		} else {
			getMendixObject().setValue(context, MemberNames.Comment_Task.toString(), comment_task.getMendixObject().getId());
		}
	}

	/**
	 * @throws com.mendix.core.CoreException
	 * @return value of Comment_TeamMember
	 */
	public final tasktracker.proxies.TeamMember getComment_TeamMember() throws com.mendix.core.CoreException
	{
		return getComment_TeamMember(getContext());
	}

	/**
	 * @param context
	 * @return value of Comment_TeamMember
	 * @throws com.mendix.core.CoreException
	 */
	public final tasktracker.proxies.TeamMember getComment_TeamMember(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		tasktracker.proxies.TeamMember result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.Comment_TeamMember.toString());
		if (identifier != null) {
			result = tasktracker.proxies.TeamMember.load(context, identifier);
		}
		return result;
	}

	/**
	 * Set value of Comment_TeamMember
	 * @param comment_teammember
	 */
	public final void setComment_TeamMember(tasktracker.proxies.TeamMember comment_teammember)
	{
		setComment_TeamMember(getContext(), comment_teammember);
	}

	/**
	 * Set value of Comment_TeamMember
	 * @param context
	 * @param comment_teammember
	 */
	public final void setComment_TeamMember(com.mendix.systemwideinterfaces.core.IContext context, tasktracker.proxies.TeamMember comment_teammember)
	{
		if (comment_teammember == null) {
			getMendixObject().setValue(context, MemberNames.Comment_TeamMember.toString(), null);
		} else {
			getMendixObject().setValue(context, MemberNames.Comment_TeamMember.toString(), comment_teammember.getMendixObject().getId());
		}
	}

	/**
	 * @throws com.mendix.core.CoreException
	 * @return value of Comment_MendixSSOUser
	 */
	public final mendixsso.proxies.MendixSSOUser getComment_MendixSSOUser() throws com.mendix.core.CoreException
	{
		return getComment_MendixSSOUser(getContext());
	}

	/**
	 * @param context
	 * @return value of Comment_MendixSSOUser
	 * @throws com.mendix.core.CoreException
	 */
	public final mendixsso.proxies.MendixSSOUser getComment_MendixSSOUser(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		mendixsso.proxies.MendixSSOUser result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.Comment_MendixSSOUser.toString());
		if (identifier != null) {
			result = mendixsso.proxies.MendixSSOUser.load(context, identifier);
		}
		return result;
	}

	/**
	 * Set value of Comment_MendixSSOUser
	 * @param comment_mendixssouser
	 */
	public final void setComment_MendixSSOUser(mendixsso.proxies.MendixSSOUser comment_mendixssouser)
	{
		setComment_MendixSSOUser(getContext(), comment_mendixssouser);
	}

	/**
	 * Set value of Comment_MendixSSOUser
	 * @param context
	 * @param comment_mendixssouser
	 */
	public final void setComment_MendixSSOUser(com.mendix.systemwideinterfaces.core.IContext context, mendixsso.proxies.MendixSSOUser comment_mendixssouser)
	{
		if (comment_mendixssouser == null) {
			getMendixObject().setValue(context, MemberNames.Comment_MendixSSOUser.toString(), null);
		} else {
			getMendixObject().setValue(context, MemberNames.Comment_MendixSSOUser.toString(), comment_mendixssouser.getMendixObject().getId());
		}
	}

	@Override
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return commentMendixObject;
	}

	@Override
	public final com.mendix.systemwideinterfaces.core.IContext getContext()
	{
		return context;
	}

	@java.lang.Override
	public boolean equals(Object obj)
	{
		if (obj == this) {
			return true;
		}
		if (obj != null && getClass().equals(obj.getClass()))
		{
			final tasktracker.proxies.Comment that = (tasktracker.proxies.Comment) obj;
			return getMendixObject().equals(that.getMendixObject());
		}
		return false;
	}

	@java.lang.Override
	public int hashCode()
	{
		return getMendixObject().hashCode();
	}

  /**
   * Gives full name ("Module.Entity" name) of the type of the entity.
   *
   * @return the name
   */
	public static java.lang.String getType()
	{
		return entityName;
	}
}